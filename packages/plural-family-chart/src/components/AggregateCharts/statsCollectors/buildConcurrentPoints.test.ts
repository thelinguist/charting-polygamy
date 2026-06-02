import { describe, it, expect } from "vitest"
import { buildConcurrentPoints } from "./buildConcurrentPoints"
import { CONCURRENT_AGE_MIN, CONCURRENT_AGE_MAX } from "../shared/chartConstants"

describe("buildConcurrentPoints", () => {
    it("returns an empty array when the map is empty", () => {
        expect(buildConcurrentPoints(new Map())).toEqual([])
    })

    it("skips ages with no data", () => {
        const map = new Map([[25, [2, 3]]])
        const result = buildConcurrentPoints(map)
        expect(result.every(p => p.age === 25)).toBe(true)
        expect(result).toHaveLength(1)
    })

    it("computes average concurrent wives correctly", () => {
        const map = new Map([[30, [2, 4]]])
        const result = buildConcurrentPoints(map)
        expect(result[0]).toEqual({ age: 30, avgConcurrent: 3 })
    })

    it("only includes ages within [CONCURRENT_AGE_MIN, CONCURRENT_AGE_MAX)", () => {
        const map = new Map([
            [CONCURRENT_AGE_MIN - 1, [5]],
            [CONCURRENT_AGE_MIN, [1]],
            [CONCURRENT_AGE_MAX - 1, [1]],
            [CONCURRENT_AGE_MAX, [5]],
        ])
        const result = buildConcurrentPoints(map)
        const ages = result.map(p => p.age)
        expect(ages).not.toContain(CONCURRENT_AGE_MIN - 1)
        expect(ages).toContain(CONCURRENT_AGE_MIN)
        expect(ages).toContain(CONCURRENT_AGE_MAX - 1)
        expect(ages).not.toContain(CONCURRENT_AGE_MAX)
    })

    it("returns points in ascending age order", () => {
        const map = new Map([
            [40, [2]],
            [25, [3]],
            [33, [1]],
        ])
        const result = buildConcurrentPoints(map)
        const ages = result.map(p => p.age)
        expect(ages).toEqual([...ages].sort((a, b) => a - b))
    })
})