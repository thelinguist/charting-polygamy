import { describe, it, expect } from "vitest"
import { computeChartStats } from "./computeChartStats"
import type { PatriarchData } from "lib"
import type { Timeline } from "lib/src/types"
import { assumptions } from "lib/src"

// Minimal valid Timeline factory
function makeTimeline(marriageStart: Date, marriageEnd: Date): Timeline {
    return {
        name: "Wife",
        birth: new Date("1840-01-01"),
        death: new Date("1910-01-01"),
        linkedMarriage: { start: marriageStart, end: marriageEnd },
        otherMarriages: [],
    }
}

function makePatriarch(timelines: Timeline[]): PatriarchData {
    return {
        patriarchTimeline: {
            name: "Patriarch",
            birth: new Date("1820-01-01"),
            death: new Date("1900-01-01"),
            marriages: [],
        },
        timelines,
    }
}

const PRE_BAN = { start: new Date("1860-01-01"), end: new Date("1895-01-01") }
const POST_BAN = { start: new Date("1892-01-01"), end: new Date("1910-01-01") }

describe("computeChartStats", () => {
    it("counts total polygamists", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
            "James Brown": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        expect(computeChartStats(chartData).polygamistCount).toBe(2)
    })

    it("finds the patriarch with the most wives and their count", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
            "James Brown": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        const stats = computeChartStats(chartData)
        expect(stats.maxWives).toBe(3)
        expect(stats.maxWivesName).toBe("James Brown")
    })

    it("computes average wives", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
            "James Brown": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        // (2 + 4) / 2 = 3
        expect(computeChartStats(chartData).averageWives).toBe(3)
    })

    it("counts concurrent marriages that started after the 1890 ban", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end), // pre-ban
                makeTimeline(POST_BAN.start, POST_BAN.end), // post-ban concurrent
            ]),
            "James Brown": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        expect(computeChartStats(chartData).afterBanCount).toBe(1)
    })

    it("counts post-ban marriages from multiple patriarchs", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(POST_BAN.start, POST_BAN.end),
            ]),
            "James Brown": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(POST_BAN.start, POST_BAN.end),
                makeTimeline(POST_BAN.start, POST_BAN.end),
            ]),
        }
        expect(computeChartStats(chartData).afterBanCount).toBe(3)
    })

    it("computes afterBanPercent as share of all concurrent marriages", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(POST_BAN.start, POST_BAN.end), // 1 of 4 total
            ]),
            "James Brown": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        // 1 post-ban out of 4 total = 25%
        expect(computeChartStats(chartData).afterBanPercent).toBe(25)
    })

    it("returns zero afterBanPercent when no post-ban marriages exist", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        const stats = computeChartStats(chartData)
        expect(stats.afterBanCount).toBe(0)
        expect(stats.afterBanPercent).toBe(0)
    })

    it("handles a single patriarch with two wives", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
            ]),
        }
        const stats = computeChartStats(chartData)
        expect(stats.polygamistCount).toBe(1)
        expect(stats.maxWives).toBe(2)
        expect(stats.maxWivesName).toBe("John Smith")
        expect(stats.averageWives).toBe(2)
    })

    it("does not count a marriage on exactly the ban date as post-ban", () => {
        const chartData = {
            "John Smith": makePatriarch([
                makeTimeline(PRE_BAN.start, PRE_BAN.end),
                makeTimeline(assumptions.polygamyEnd, new Date("1910-01-01")),
            ]),
        }
        expect(computeChartStats(chartData).afterBanCount).toBe(0)
    })
})
