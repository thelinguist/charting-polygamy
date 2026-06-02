import { describe, it, expect } from "vitest"
import { wifeDidLeave } from "./wifeDidLeave"
import type { WifeTimeline } from "./patriarchTypes"

const MS_PER_DAY = 86_400_000

function makeWife(overrides: Partial<WifeTimeline> = {}): WifeTimeline {
    return {
        name: "Test Wife",
        birth: new Date(1840, 0, 1),
        death: undefined,
        linkedMarriage: { start: new Date(1860, 0, 1) },
        otherMarriages: [],
        marriages: [],
        ...overrides,
    } as unknown as WifeTimeline
}

describe("wifeDidLeave", () => {
    it("returns false when there is no linkedMarriage end", () => {
        const wife = makeWife({ linkedMarriage: { start: new Date(1860, 0, 1) } })
        expect(wifeDidLeave(wife, new Date(1890, 0, 1))).toBe(false)
    })

    it("returns false when patriarchDeath is undefined", () => {
        const wife = makeWife({ linkedMarriage: { start: new Date(1860, 0, 1), end: new Date(1870, 0, 1) } })
        expect(wifeDidLeave(wife, undefined)).toBe(false)
    })

    it("returns true when marriage ended before patriarch died and not near wife's death", () => {
        const wife = makeWife({
            linkedMarriage: { start: new Date(1860, 0, 1), end: new Date(1870, 0, 1) },
            death: new Date(1900, 0, 1),
        } as any)
        expect(wifeDidLeave(wife, new Date(1890, 0, 1))).toBe(true)
    })

    it("returns false when marriage ended after patriarch died", () => {
        const wife = makeWife({
            linkedMarriage: { start: new Date(1860, 0, 1), end: new Date(1895, 0, 1) },
            death: new Date(1900, 0, 1),
        } as any)
        expect(wifeDidLeave(wife, new Date(1890, 0, 1))).toBe(false)
    })

    it("returns false when marriage end is within 7 days of wife's death (death-in-marriage)", () => {
        const wifeDeathDate = new Date(1875, 6, 10)
        const marriageEnd = new Date(wifeDeathDate.getTime() + 3 * MS_PER_DAY) // 3 days after death
        const wife = makeWife({
            linkedMarriage: { start: new Date(1860, 0, 1), end: marriageEnd },
            death: wifeDeathDate,
        } as any)
        expect(wifeDidLeave(wife, new Date(1890, 0, 1))).toBe(false)
    })

    it("returns true when marriage end is more than 7 days from wife's death", () => {
        const wifeDeathDate = new Date(1875, 6, 10)
        const marriageEnd = new Date(1870, 0, 1) // years before wife's death
        const wife = makeWife({
            linkedMarriage: { start: new Date(1860, 0, 1), end: marriageEnd },
            death: wifeDeathDate,
        } as any)
        expect(wifeDidLeave(wife, new Date(1890, 0, 1))).toBe(true)
    })

    it("returns true when wife has no recorded death date and marriage ended before patriarch", () => {
        const wife = makeWife({
            linkedMarriage: { start: new Date(1860, 0, 1), end: new Date(1870, 0, 1) },
            death: undefined,
        } as any)
        expect(wifeDidLeave(wife, new Date(1890, 0, 1))).toBe(true)
    })
})