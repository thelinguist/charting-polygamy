import { describe, it, expect } from "vitest"
import { collectConcurrentWives } from "./collectConcurrentWives"
import { CONCURRENT_AGE_MIN, CONCURRENT_AGE_MAX } from "../shared/chartConstants"
import type { PatriarchMarriage } from "./patriarchTypes"

function marriage(startYear: number, endYear?: number): PatriarchMarriage {
    return {
        start: new Date(startYear, 0, 1),
        end: endYear != null ? new Date(endYear, 0, 1) : undefined,
    }
}

describe("collectConcurrentWives", () => {
    it("accumulates concurrent counts into the map", () => {
        const birth = new Date(1820, 0, 1)
        const death = new Date(1890, 0, 1)
        const map = new Map<number, number[]>()
        // One marriage active from age 30 onward (birth year + 30 = 1850)
        collectConcurrentWives(birth, death, [marriage(1850)], map)
        // At age 30 the patriarch has 1 concurrent wife
        expect(map.get(30)).toContain(1)
    })

    it("stops iterating once checkDate exceeds patriarch's death", () => {
        const birth = new Date(1820, 0, 1)
        const death = new Date(1840, 0, 1) // dies at age 20, before CONCURRENT_AGE_MIN (18)
        const map = new Map<number, number[]>()
        collectConcurrentWives(birth, death, [marriage(1838)], map)
        // Only ages 18 and 19 are checked (death is Jan 1 1840, age 20 check date == death, loop breaks)
        expect([...map.keys()].every(age => age < CONCURRENT_AGE_MAX)).toBe(true)
    })

    it("counts 0 concurrent wives when no marriages are active at an age", () => {
        const birth = new Date(1820, 0, 1)
        const death = new Date(1890, 0, 1)
        const map = new Map<number, number[]>()
        // Marriage only active in 1870–1875 (ages 50–55)
        collectConcurrentWives(birth, death, [marriage(1870, 1875)], map)
        expect(map.get(CONCURRENT_AGE_MIN)).toContain(0)
    })

    it("skips marriages without a start date", () => {
        const birth = new Date(1820, 0, 1)
        const death = new Date(1890, 0, 1)
        const map = new Map<number, number[]>()
        collectConcurrentWives(birth, death, [{ end: new Date(1870, 0, 1) }], map)
        // No marriages active, all counts should be 0
        expect(map.get(CONCURRENT_AGE_MIN)).toContain(0)
    })

    it("uses patriarch death as marriage end when no end is specified", () => {
        const birth = new Date(1820, 0, 1)
        const death = new Date(1890, 0, 1)
        const map = new Map<number, number[]>()
        // Marriage started at age 30 with no explicit end — should remain active until death (age 70)
        collectConcurrentWives(birth, death, [marriage(1850)], map)
        expect(map.get(60)).toContain(1) // age 60 = year 1880, before death
    })

    it("appends to existing map entries across multiple calls", () => {
        const birth = new Date(1820, 0, 1)
        const death = new Date(1890, 0, 1)
        const map = new Map<number, number[]>()
        collectConcurrentWives(birth, death, [marriage(1850)], map)
        collectConcurrentWives(birth, death, [marriage(1850)], map)
        // Two patriarchs with one marriage each — both contribute a count at age 30
        expect(map.get(30)?.length).toBeGreaterThanOrEqual(2)
    })
})