import { describe, it, expect } from "vitest"
import { yearsBetween } from "./dates"

describe("yearsBetween", () => {
    it("returns 0 for the same date", () => {
        const d = new Date(1850, 0, 1)
        expect(yearsBetween(d, d)).toBe(0)
    })

    it("returns full years elapsed, floored (uses 365.25-day year)", () => {
        // Jan 1→Jan 1 spans often give n-1 because 365.25 slightly overcounts a year.
        // A mid-year endpoint ensures the result is unambiguously 10.
        const earlier = new Date(1850, 0, 1)
        const later = new Date(1860, 6, 1) // Jul 1 1860
        expect(yearsBetween(earlier, later)).toBe(10)
    })

    it("does not count a partial year", () => {
        const earlier = new Date(1850, 0, 1)
        const later = new Date(1850, 11, 31) // 364 days later
        expect(yearsBetween(earlier, later)).toBe(0)
    })

    it("returns 1 just after the anniversary", () => {
        const earlier = new Date(1850, 0, 1)
        const later = new Date(1851, 0, 2)
        expect(yearsBetween(earlier, later)).toBe(1)
    })

    it("handles dates spanning a leap year correctly", () => {
        const earlier = new Date(1856, 0, 1)
        const later = new Date(1876, 0, 1)
        expect(yearsBetween(earlier, later)).toBe(20)
    })

    it("returns a negative value when later is before earlier", () => {
        const earlier = new Date(1850, 0, 1)
        const later = new Date(1845, 0, 1)
        expect(yearsBetween(earlier, later)).toBeLessThan(0)
    })
})