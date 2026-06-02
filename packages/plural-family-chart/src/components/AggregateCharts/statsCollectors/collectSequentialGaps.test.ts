import { describe, it, expect } from "vitest"
import { collectSequentialGaps } from "./collectSequentialGaps"
import { SEQ_GAP_MIN, SEQ_GAP_MAX } from "../shared/chartConstants"
import type { PatriarchMarriage } from "./patriarchTypes"

function marriage(year: number): PatriarchMarriage {
    return { start: new Date(year, 0, 1) }
}

describe("collectSequentialGaps", () => {
    it("does nothing with fewer than 2 marriages", () => {
        const result: number[] = []
        collectSequentialGaps([marriage(1850)], result)
        expect(result).toHaveLength(0)
    })

    it("pushes the gap between consecutive marriage start years", () => {
        const result: number[] = []
        // 1852→1857 crosses 2 leap years (1852, 1856) = 1827 days.
        // 1827 / 365.25 = 5.001 → floor = 5 (clean result, no rounding ambiguity)
        collectSequentialGaps([marriage(1852), marriage(1857)], result)
        expect(result).toEqual([5])
    })

    it("collects gaps for all consecutive pairs", () => {
        const result: number[] = []
        // 1848→1852: 1461 days (leap: 1848) → floor(1461/365.25) = 4
        // 1852→1857: 1827 days (leaps: 1852, 1856) → floor(1827/365.25) = 5
        collectSequentialGaps([marriage(1848), marriage(1852), marriage(1857)], result)
        expect(result).toEqual([4, 5])
    })

    it("skips pairs where either start date is missing", () => {
        const result: number[] = []
        const marriages: PatriarchMarriage[] = [{ start: new Date(1850, 0, 1) }, {}, { start: new Date(1858, 0, 1) }]
        collectSequentialGaps(marriages, result)
        expect(result).toHaveLength(0)
    })

    it(`excludes gaps below SEQ_GAP_MIN (${SEQ_GAP_MIN})`, () => {
        // SEQ_GAP_MIN is 0, so a gap of -1 years (reverse order) should be excluded
        const result: number[] = []
        collectSequentialGaps([marriage(1855), marriage(1850)], result)
        expect(result).toHaveLength(0)
    })

    it(`excludes gaps at or above SEQ_GAP_MAX (${SEQ_GAP_MAX})`, () => {
        const result: number[] = []
        collectSequentialGaps([marriage(1850), marriage(1850 + SEQ_GAP_MAX)], result)
        expect(result).toHaveLength(0)
    })

    it("includes a gap exactly at SEQ_GAP_MIN", () => {
        const result: number[] = []
        // A gap of 0 full years (same year, but day+1 so it's technically 0)
        collectSequentialGaps([marriage(1850), marriage(1850)], result)
        expect(result).toEqual([0])
    })
})