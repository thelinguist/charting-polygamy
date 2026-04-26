import type { PatriarchData } from "lib"
import type { OtherMarriage, PatriarchTimeline, Timeline } from "lib/src/types"

// Compact key mapping — see plan for full table
// Wrapper: n=name, pt=patriarchTimeline, tl=timelines
// PatriarchTimeline: n, b=birth, d=death, m=marriages
// Marriage: s=start, e=end, a=age, g=gap
// Timeline: n, b, d, lm=linkedMarriage, om=otherMarriages, a=age, g=gap
// OtherMarriage: s, e, sp=spouse

type CompactDate = string // "YYYY-MM-DD"

const toDateStr = (d: Date): CompactDate => d.toISOString().slice(0, 10)
const fromDateStr = (s: CompactDate): Date => new Date(s)

interface CompactOtherMarriage {
    s: CompactDate
    e: CompactDate
    sp: string
}

interface CompactLinkedMarriage {
    s?: CompactDate
    e?: CompactDate
}

interface CompactMarriage {
    s?: CompactDate
    e?: CompactDate
    a?: number
    g?: number
}

interface CompactPatriarchTimeline {
    n: string
    b: CompactDate
    d: CompactDate
    m: CompactMarriage[]
}

interface CompactTimeline {
    n: string
    b: CompactDate
    d: CompactDate
    lm: CompactLinkedMarriage
    om?: CompactOtherMarriage[]
    a?: number
    g?: number
}

interface CompactPayload {
    n: string
    pt: CompactPatriarchTimeline
    tl: CompactTimeline[]
}

function compactMarriage(m: PatriarchTimeline["marriages"][number]): CompactMarriage {
    const out: CompactMarriage = {}
    if (m.start) out.s = toDateStr(m.start)
    if (m.end) out.e = toDateStr(m.end)
    if (m.age !== undefined) out.a = m.age
    if (m.gap !== undefined) out.g = m.gap
    return out
}

function expandMarriage(m: CompactMarriage): PatriarchTimeline["marriages"][number] {
    const out: PatriarchTimeline["marriages"][number] = {}
    if (m.s) out.start = fromDateStr(m.s)
    if (m.e) out.end = fromDateStr(m.e)
    if (m.a !== undefined) out.age = m.a
    if (m.g !== undefined) out.gap = m.g
    return out
}

function compactOtherMarriage(o: OtherMarriage): CompactOtherMarriage {
    return { s: toDateStr(o.start), e: toDateStr(o.end), sp: o.spouse }
}

function expandOtherMarriage(o: CompactOtherMarriage): OtherMarriage {
    return { start: fromDateStr(o.s), end: fromDateStr(o.e), spouse: o.sp }
}

function compactTimeline(t: Timeline): CompactTimeline {
    const lm: CompactLinkedMarriage = {}
    if (t.linkedMarriage.start) lm.s = toDateStr(t.linkedMarriage.start)
    if (t.linkedMarriage.end) lm.e = toDateStr(t.linkedMarriage.end)

    const out: CompactTimeline = {
        n: t.name,
        b: toDateStr(t.birth),
        d: toDateStr(t.death),
        lm,
    }
    if (t.otherMarriages.length > 0) out.om = t.otherMarriages.map(compactOtherMarriage)
    if (t.age !== undefined) out.a = t.age
    if (t.gap !== undefined) out.g = t.gap
    return out
}

function expandTimeline(t: CompactTimeline): Timeline {
    const linkedMarriage = {} as Timeline["linkedMarriage"]
    if (t.lm.s) linkedMarriage.start = fromDateStr(t.lm.s)
    if (t.lm.e) linkedMarriage.end = fromDateStr(t.lm.e)

    const out: Timeline = {
        name: t.n,
        birth: fromDateStr(t.b),
        death: fromDateStr(t.d),
        linkedMarriage: linkedMarriage as Timeline["linkedMarriage"],
        otherMarriages: t.om ? t.om.map(expandOtherMarriage) : [],
    }
    if (t.a !== undefined) out.age = t.a
    if (t.g !== undefined) out.gap = t.g
    return out
}

async function readAllChunks(readable: ReadableStream<Uint8Array>): Promise<Uint8Array> {
    const chunks: Uint8Array[] = []
    const reader = readable.getReader()
    while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
    }
    const out = new Uint8Array(chunks.reduce((n, c) => n + c.length, 0))
    let offset = 0
    for (const chunk of chunks) {
        out.set(chunk, offset)
        offset += chunk.length
    }
    return out
}

async function compress(str: string): Promise<Uint8Array> {
    const stream = new CompressionStream("deflate-raw")
    const writer = stream.writable.getWriter()
    const [, bytes] = await Promise.all([
        writer.write(new TextEncoder().encode(str)).then(() => writer.close()),
        readAllChunks(stream.readable),
    ])
    return bytes
}

async function decompress(bytes: Uint8Array): Promise<string> {
    const stream = new DecompressionStream("deflate-raw")
    const writer = stream.writable.getWriter()
    const [, out] = await Promise.all([writer.write(bytes).then(() => writer.close()), readAllChunks(stream.readable)])
    return new TextDecoder().decode(out)
}

function toBase64url(bytes: Uint8Array): string {
    let binary = ""
    for (const byte of bytes) binary += String.fromCharCode(byte)
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
}

function fromBase64url(str: string): Uint8Array {
    const padded = str + "===".slice((str.length + 3) % 4)
    const binary = atob(padded.replace(/-/g, "+").replace(/_/g, "/"))
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return bytes
}

export async function encodePatriarchData(name: string, data: PatriarchData): Promise<string> {
    const payload: CompactPayload = {
        n: name,
        pt: {
            n: data.patriarchTimeline.name,
            b: toDateStr(data.patriarchTimeline.birth),
            d: toDateStr(data.patriarchTimeline.death),
            m: data.patriarchTimeline.marriages.map(compactMarriage),
        },
        tl: data.timelines.map(compactTimeline),
    }
    const bytes = await compress(JSON.stringify(payload))
    return toBase64url(bytes)
}

export async function decodePatriarchData(encoded: string): Promise<{ name: string; data: PatriarchData }> {
    const json = await decompress(fromBase64url(encoded))
    const payload: CompactPayload = JSON.parse(json)

    return {
        name: payload.n,
        data: {
            patriarchTimeline: {
                name: payload.pt.n,
                birth: fromDateStr(payload.pt.b),
                death: fromDateStr(payload.pt.d),
                marriages: payload.pt.m.map(expandMarriage),
            },
            timelines: payload.tl.map(expandTimeline),
        },
    }
}
