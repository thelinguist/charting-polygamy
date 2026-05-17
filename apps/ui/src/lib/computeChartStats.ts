import type { PatriarchData } from "lib"
import type { ChartStats } from "../components/ChartStats/types"
import { Statistics } from "lib/src/types"
import { assumptions } from "lib/src"

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
            if (timeline.linkedMarriage.start > assumptions.polygamyEnd) {
                afterBanCount++
            }
        }
    }

    return {
        polygamistCount,
        practicingPercent: timelinesStats
            ? timelinesStats.polygamousFamilies / timelinesStats.eligiblePatriarchs
            : undefined,
        averageWives: polygamistCount > 0 ? totalWives / polygamistCount : 0,
        maxWives,
        maxWivesName,
        afterBanCount,
        afterBanPercent: totalWives > 0 ? Math.round((afterBanCount / totalWives) * 100) : 0,
    }
}
