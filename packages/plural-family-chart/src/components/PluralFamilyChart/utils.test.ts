import { describe, expect, it } from "vitest"
import { getMarriageDomain } from "./utils"
import { PatriarchTimeline, Timeline } from "lib/src/types"

const noTimelines: Timeline[] = []

const basePatriarch: PatriarchTimeline = {
    name: "John",
    birth: new Date("1820-07-01"),
    death: new Date("1900-07-01"),
    marriages: [],
}

describe("getMarriageDomain", () => {
    it("returns null when no marriages have a start date", () => {
        const patriarch: PatriarchTimeline = {
            ...basePatriarch,
            marriages: [{ end: new Date("1880-07-01") }, {}],
        }
        expect(getMarriageDomain(patriarch, noTimelines)).toBeNull()
    })

    it("returns a range padded by 10% of the marriage span, clamped to the chart extent", () => {
        // Marriage: 1845 → 1885 (40 years). Padding = 4 years each side → 1841 → 1889.
        // Chart extent: birth 1820 → death 1900. No clamping needed.
        const patriarch: PatriarchTimeline = {
            ...basePatriarch,
            marriages: [{ start: new Date("1845-07-01"), end: new Date("1885-07-01") }],
        }
        const result = getMarriageDomain(patriarch, noTimelines)!
        expect(result).not.toBeNull()
        expect(result[0].getFullYear()).toBe(1841)
        expect(result[1].getFullYear()).toBe(1889)
    })

    it("spans the earliest start to the latest end across multiple marriages", () => {
        // Marriages: 1845–1870 and 1860–1880. Span = 1845→1880 = 35 years. Padding = 3.5 yrs.
        const patriarch: PatriarchTimeline = {
            ...basePatriarch,
            marriages: [
                { start: new Date("1845-07-01"), end: new Date("1870-07-01") },
                { start: new Date("1860-07-01"), end: new Date("1880-07-01") },
            ],
        }
        const result = getMarriageDomain(patriarch, noTimelines)!
        expect(result[0] < new Date("1845-07-01")).toBe(true) // padded before first marriage
        expect(result[1] > new Date("1880-07-01")).toBe(true) // padded after last marriage end
        expect(result[0] > new Date("1820-07-01")).toBe(true) // not pushed before birth
    })

    it("clamps start to the earliest birth when padding would exceed the chart extent", () => {
        // Patriarch born 1843, first marriage 1845 — only 2 yrs before first marriage.
        // Span 1845→1880 = 35 yrs, padding 3.5 yrs → raw padded start 1841.5 < birth 1843.
        const patriarch: PatriarchTimeline = {
            ...basePatriarch,
            birth: new Date("1843-07-01"),
            marriages: [{ start: new Date("1845-07-01"), end: new Date("1880-07-01") }],
        }
        const result = getMarriageDomain(patriarch, noTimelines)!
        expect(result[0].getTime()).toBe(new Date("1843-07-01").getTime())
    })

    it("uses patriarch death as the marriage end when end is omitted", () => {
        // Marriage has no end → falls back to patriarch death 1900.
        // Span 1845→1900 = 55 yrs. Padding = 5.5 yrs. Raw: 1839.5 → 1905.5, clamped: 1820 → 1900.
        const patriarch: PatriarchTimeline = {
            ...basePatriarch,
            marriages: [{ start: new Date("1845-07-01") }],
        }
        const result = getMarriageDomain(patriarch, noTimelines)!
        expect(result[1].getTime()).toBe(new Date("1900-07-01").getTime())
    })
})
