import type { PatriarchData } from "lib"
import type { ChartStats } from "../components/ChartStats/types"
import { Statistics } from "lib/src/types"

const BAN_DATE = new Date("1890-09-24")

export function computeChartStats(chartData: Record<string, PatriarchData>, timelinesStats?: Statistics): ChartStats {
    const entries = Object.entries(chartData)
    const polygamistCount = entries.length

    let maxWives = 0
    let maxWivesName = ""
    let totalWives = 0
    let afterBanCount = 0

    for (const [name, data] of entries) {
        const wifeCount = data.timelines.length
        totalWives += wifeCount
        if (wifeCount > maxWives) {
            maxWives = wifeCount
            maxWivesName = name
        }
        for (const timeline of data.timelines) {
            if (timeline.linkedMarriage.start > BAN_DATE) {
                afterBanCount++
            }
        }
    }

    const averageWives = polygamistCount > 0 ? totalWives / polygamistCount : 0
    const practicingPercent = timelinesStats
        ? timelinesStats.polygamousFamilies / timelinesStats.eligiblePatriarchs
        : undefined

    // Ascent bias correction via inverse probability weighting:
    // θ = p̂ / (k − p̂·(k−1))
    // where p̂ = observed rate, k = avg wives (proxy for reproductive advantage)
    const adjustedPracticingPercent =
        practicingPercent !== undefined && averageWives > 1
            ? practicingPercent / (averageWives - practicingPercent * (averageWives - 1))
            : undefined

    return {
        polygamistCount,
        practicingPercent,
        adjustedPracticingPercent,
        averageWives,
        maxWives,
        maxWivesName,
        afterBanCount,
        afterBanPercent: totalWives > 0 ? Math.round((afterBanCount / totalWives) * 100) : 0,
    }
}
