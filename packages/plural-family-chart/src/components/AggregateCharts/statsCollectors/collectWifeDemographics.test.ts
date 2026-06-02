import { describe, it, expect } from "vitest"
import { collectWifeDemographics } from "./collectWifeDemographics"
import type { WifeTimeline, PatriarchMarriage } from "./patriarchTypes"

function makeWife(age?: number): WifeTimeline {
    return {
        name: "Jane",
        birth: new Date(1845, 0, 1),
        death: undefined,
        linkedMarriage: { start: new Date(1862, 0, 1) },
        otherMarriages: [],
        marriages: [],
        age,
    } as unknown as WifeTimeline
}

function makeMarriage(year?: number, patriarchAge?: number): PatriarchMarriage {
    return {
        start: year != null ? new Date(year, 0, 1) : undefined,
        age: patriarchAge,
    }
}

describe("collectWifeDemographics", () => {
    it("does not push age when wife.age is null", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(undefined), 0, makeMarriage(1862, 40), all, first, sub, orderAges, gaps, years)
        expect(all).toHaveLength(0)
        expect(first).toHaveLength(0)
        expect(gaps).toHaveLength(0)
    })

    it("adds wife age to allWifeAges and firstAges when position is 0", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(20), 0, makeMarriage(1862), all, first, sub, orderAges, gaps, years)
        expect(all).toEqual([20])
        expect(first).toEqual([20])
        expect(sub).toHaveLength(0)
    })

    it("adds wife age to subsequentAges when position > 0", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(18), 1, makeMarriage(1863), all, first, sub, orderAges, gaps, years)
        expect(first).toHaveLength(0)
        expect(sub).toEqual([18])
    })

    it("caps bucket at index 3 for the 4th+ wife", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(16), 4, makeMarriage(1865), all, first, sub, orderAges, gaps, years)
        expect(orderAges.has(3)).toBe(true)
        expect(orderAges.has(4)).toBe(false)
    })

    it("computes age gap as patriarch age minus wife age", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(18), 0, makeMarriage(1862, 40), all, first, sub, orderAges, gaps, years)
        expect(gaps).toEqual([22]) // 40 - 18
    })

    it("does not push a gap when patriarch age is missing", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(18), 0, makeMarriage(1862, undefined), all, first, sub, orderAges, gaps, years)
        expect(gaps).toHaveLength(0)
    })

    it("pushes the marriage year when pMarriage.start is present", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(20), 0, makeMarriage(1855), all, first, sub, orderAges, gaps, years)
        expect(years).toEqual([1855])
    })

    it("does not push a year when pMarriage.start is absent", () => {
        const all: number[] = [], first: number[] = [], sub: number[] = []
        const orderAges = new Map<number, number[]>()
        const gaps: number[] = [], years: number[] = []
        collectWifeDemographics(makeWife(20), 0, makeMarriage(undefined), all, first, sub, orderAges, gaps, years)
        expect(years).toHaveLength(0)
    })
})