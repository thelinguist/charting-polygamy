import { describe, it, expect } from "vitest"
import { createBins, createCustomBins } from "./math"

describe("createBins", () => {
    it("creates empty bins when data is empty", () => {
        const bins = createBins([], 0, 10, 5)
        expect(bins).toEqual([
            { x0: 0, x1: 5, count: 0 },
            { x0: 5, x1: 10, count: 0 },
        ])
    })

    it("places values into the correct bin", () => {
        const bins = createBins([1, 2, 6], 0, 10, 5)
        expect(bins[0].count).toBe(2) // 1, 2 fall in [0, 5)
        expect(bins[1].count).toBe(1) // 6 falls in [5, 10)
    })

    it("treats x0 as inclusive and x1 as exclusive", () => {
        const bins = createBins([5], 0, 10, 5)
        expect(bins[0].count).toBe(0) // 5 is NOT in [0, 5)
        expect(bins[1].count).toBe(1) // 5 IS in [5, 10)
    })

    it("excludes values equal to max", () => {
        const bins = createBins([10], 0, 10, 5)
        expect(bins[0].count).toBe(0)
        expect(bins[1].count).toBe(0)
    })

    it("returns correct x0/x1 boundaries for each bin", () => {
        const bins = createBins([], 1840, 1860, 10)
        expect(bins[0]).toMatchObject({ x0: 1840, x1: 1850 })
        expect(bins[1]).toMatchObject({ x0: 1850, x1: 1860 })
    })
})

describe("createCustomBins", () => {
    it("creates bins between each pair of edges", () => {
        const edges = [11, 14, 17, 22]
        const bins = createCustomBins([], edges)
        expect(bins).toHaveLength(3)
        expect(bins[0]).toMatchObject({ x0: 11, x1: 14, count: 0 })
        expect(bins[1]).toMatchObject({ x0: 14, x1: 17, count: 0 })
        expect(bins[2]).toMatchObject({ x0: 17, x1: 22, count: 0 })
    })

    it("assigns values to the correct custom bin", () => {
        const edges = [11, 14, 17, 22]
        const bins = createCustomBins([11, 13, 14, 17, 18, 21], edges)
        expect(bins[0].count).toBe(2) // 11, 13 → [11, 14)
        expect(bins[1].count).toBe(1) // 14     → [14, 17); 17 is NOT < 17
        expect(bins[2].count).toBe(3) // 17, 18, 21 → [17, 22)
    })

    it("returns an empty array for a single edge", () => {
        expect(createCustomBins([1, 2], [10])).toEqual([])
    })

    it("excludes values outside all bin ranges", () => {
        const bins = createCustomBins([5, 100], [11, 22])
        expect(bins[0].count).toBe(0)
    })
})