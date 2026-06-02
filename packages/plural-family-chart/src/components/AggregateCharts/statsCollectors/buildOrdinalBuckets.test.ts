import { describe, it, expect } from "vitest"
import { buildOrdinalBuckets } from "./buildOrdinalBuckets"

describe("buildOrdinalBuckets", () => {
    it("returns an empty array when the map is empty", () => {
        expect(buildOrdinalBuckets(new Map())).toEqual([])
    })

    it("filters out positions with no data", () => {
        const orderAges = new Map([[0, [20, 22]], [2, [18]]])
        const result = buildOrdinalBuckets(orderAges)
        expect(result.map(b => b.position)).toEqual(["1st", "3rd"])
    })

    it("assigns correct position labels", () => {
        const orderAges = new Map([
            [0, [20]],
            [1, [18]],
            [2, [16]],
            [3, [15]],
        ])
        const result = buildOrdinalBuckets(orderAges)
        expect(result.map(b => b.position)).toEqual(["1st", "2nd", "3rd", "4th+"])
    })

    it("computes the average age correctly", () => {
        const orderAges = new Map([[0, [20, 30]]])
        const result = buildOrdinalBuckets(orderAges)
        expect(result[0].avgAge).toBe(25)
    })

    it("sets avgAge to 0 for an empty bucket (before filtering)", () => {
        // No data for position 1, so it gets filtered out — confirm it doesn't appear
        const orderAges = new Map([[0, [20]]])
        const result = buildOrdinalBuckets(orderAges)
        expect(result).toHaveLength(1)
        expect(result[0].position).toBe("1st")
    })

    it("includes the correct count", () => {
        const orderAges = new Map([[1, [17, 19, 21]]])
        const result = buildOrdinalBuckets(orderAges)
        expect(result[0].count).toBe(3)
    })
})