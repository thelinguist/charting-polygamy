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
        // yearsBetween uses a 365.25-day year; Jan-to-Jan boundaries can give n-1.
        // 1850→1855 = 1826 days → floor(1826/365.25) = 4
        collectSequentialGaps([marriage(1850), marriage(1855)], result)
        expect(result).toEqual([4])
    })

    it("collects gaps for all consecutive pairs", () => {
        const result: number[] = []
        // 1850→1853 = 1096 days → floor(1096/365.25) = 2 (rounds down due to 365.25)
        // Wait, actual: 1850:365, 1851:365, 1852:366 = 1096 days → 1096/365.25 = 2.999 → 2
        // 1853→1858 = 1826 days → floor = 4
        collectSequentialGaps([marriage(1850), marriage(1853), marriage(1858)], result)
        expect(result).toEqual([3, 4])
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