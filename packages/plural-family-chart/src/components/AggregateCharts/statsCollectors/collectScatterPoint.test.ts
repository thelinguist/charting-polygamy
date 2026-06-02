import { describe, it, expect } from "vitest"
import { collectScatterPoint } from "./collectScatterPoint"
import type { WifeTimeline, PatriarchMarriage } from "./patriarchTypes"

function makeWife(overrides: Partial<WifeTimeline> = {}): WifeTimeline {
    return {
        name: "Jane",
        birth: new Date(1845, 0, 1),
        death: undefined,
        linkedMarriage: { start: new Date(1862, 0, 1) },
        otherMarriages: [],
        marriages: [],
        age: 17,
        ...overrides,
    } as unknown as WifeTimeline
}

function makeMarriage(overrides: Partial<PatriarchMarriage> = {}): PatriarchMarriage {
    return { start: new Date(1862, 0, 1), age: 40, ...overrides }
}

describe("collectScatterPoint", () => {
    it("does nothing when wife.age is null", () => {
        const points: any[] = []
        collectScatterPoint(makeWife({ age: undefined }), makeMarriage(), "John", points)
        expect(points).toHaveLength(0)
    })

    it("does nothing when pMarriage is undefined", () => {
        const points: any[] = []
        collectScatterPoint(makeWife(), undefined, "John", points)
        expect(points).toHaveLength(0)
    })

    it("does nothing when pMarriage.age is null", () => {
        const points: any[] = []
        collectScatterPoint(makeWife(), makeMarriage({ age: undefined }), "John", points)
        expect(points).toHaveLength(0)
    })

    it("pushes a scatter point with correct ages and names", () => {
        const points: any[] = []
        collectScatterPoint(makeWife({ age: 17 }), makeMarriage({ age: 40 }), "John Smith", points)
        expect(points).toHaveLength(1)
        expect(points[0]).toMatchObject({
            wifeAge: 17,
            patriarchAge: 40,
            wifeName: "Jane",
            patriarchName: "John Smith",
        })
    })

    it("sets previouslyMarried=false when wife has no other marriages before the linked one", () => {
        const points: any[] = []
        collectScatterPoint(makeWife({ otherMarriages: [] } as any), makeMarriage(), "John", points)
        expect(points[0].previouslyMarried).toBe(false)
    })

    it("sets previouslyMarried=true when wife has an earlier marriage", () => {
        const linkedStart = new Date(1862, 0, 1)
        const wife = makeWife({
            linkedMarriage: { start: linkedStart },
            otherMarriages: [{ start: new Date(1855, 0, 1), end: new Date(1860, 0, 1), spouse: "Bob" }],
        } as any)
        const points: any[] = []
        collectScatterPoint(wife, makeMarriage(), "John", points)
        expect(points[0].previouslyMarried).toBe(true)
    })

    it("sets previouslyMarried=false when other marriage started after the linked one", () => {
        const linkedStart = new Date(1862, 0, 1)
        const wife = makeWife({
            linkedMarriage: { start: linkedStart },
            otherMarriages: [{ start: new Date(1870, 0, 1), end: new Date(1880, 0, 1), spouse: "Bob" }],
        } as any)
        const points: any[] = []
        collectScatterPoint(wife, makeMarriage(), "John", points)
        expect(points[0].previouslyMarried).toBe(false)
    })
})