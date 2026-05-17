import type { PatriarchData } from "lib"
import type { OtherMarriage, PatriarchTimeline, Statistics, Timeline } from "lib/src/types"

const STORAGE_KEY = "chart_session_v1"

// Compact types — mirrors shareUrl.ts key-mapping but stored as plain JSON (no compression)
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

export interface SavedSession {
    version: 1
    savedAt: string
    source: "file" | "manual"
    fileName?: string
    data: CompactPayload[]
    stats?: Statistics
    notes?: Record<string, string>
}

// --- Compact helpers ---

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

function serializeChartData(data: Record<string, PatriarchData>): CompactPayload[] {
    return Object.entries(data).map(([name, pd]) => ({
        n: name,
        pt: {
            n: pd.patriarchTimeline.name,
            b: toDateStr(pd.patriarchTimeline.birth),
            d: toDateStr(pd.patriarchTimeline.death),
            m: pd.patriarchTimeline.marriages.map(compactMarriage),
        },
        tl: pd.timelines.map(compactTimeline),
    }))
}

// --- Validation ---

function isValidDateStr(s: unknown): boolean {
    return typeof s === "string" && !isNaN(new Date(s).getTime())
}

function isValidSession(raw: unknown): raw is SavedSession {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return false
    const r = raw as Record<string, unknown>
    if (r.version !== 1) return false
    if (!isValidDateStr(r.savedAt)) return false
    if (r.source !== "file" && r.source !== "manual") return false
    if (!Array.isArray(r.data) || r.data.length === 0) return false
    const first = r.data[0] as Record<string, unknown>
    if (typeof first.n !== "string" || !first.n) return false
    if (typeof first.pt !== "object" || first.pt === null) return false
    const pt = first.pt as Record<string, unknown>
    if (!isValidDateStr(pt.b) || !isValidDateStr(pt.d)) return false
    if (!Array.isArray(first.tl)) return false
    return true
}

// --- Public API ---

export function saveSession(
    data: Record<string, PatriarchData>,
    source: "file" | "manual",
    fileName?: string,
    stats?: Statistics,
): void {
    try {
        const session: SavedSession = {
            version: 1,
            savedAt: new Date().toISOString(),
            source,
            ...(fileName ? { fileName } : {}),
            ...(stats ? { stats } : {}),
            data: serializeChartData(data),
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
        // quota exceeded, private mode, etc. — silently swallow
    }
}

export function loadSession(): SavedSession | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const parsed: unknown = JSON.parse(raw)
        return isValidSession(parsed) ? parsed : null
    } catch {
        return null
    }
}

export function updateSessionNotes(notes: Record<string, string>): void {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const session = JSON.parse(raw) as SavedSession
        session.notes = notes
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    } catch {
        // silently swallow
    }
}

export function clearSession(): void {
    try {
        localStorage.removeItem(STORAGE_KEY)
    } catch {
        // silently swallow
    }
}

export function deserializeSession(session: SavedSession): Record<string, PatriarchData> {
    try {
        return Object.fromEntries(
            session.data.map(payload => [
                payload.n,
                {
                    patriarchTimeline: {
                        name: payload.pt.n,
                        birth: fromDateStr(payload.pt.b),
                        death: fromDateStr(payload.pt.d),
                        marriages: payload.pt.m.map(expandMarriage),
                    },
                    timelines: payload.tl.map(expandTimeline),
                },
            ])
        )
    } catch {
        return {}
    }
}
