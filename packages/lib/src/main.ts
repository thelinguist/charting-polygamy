import { FileTypes, PatriarchTimeline, Statistics, Timeline } from "./types"
import { createKnowledgeTree } from "./steps/createKnowledgeTree"
import { createTimeline } from "./steps/createTimeline"
import { charting, setConfig, UserIntervention } from "./util"
import { getFacts } from "./steps/createDB"
import { checkIfPolygamous } from "./steps/checkIfPolygamous"
import {
    incrementEligibilityCount,
    incrementIllegallyMarriedCount,
    incrementPatriarchCount,
    incrementPolygamousCount,
    reportStats,
} from "./steps/stats"
import { patriarchIsEligible } from "./steps/patriarchIsEligible"

interface GetTimelinesProps {
    fileContents: string
    fileFormat: FileTypes
    patriarchName?: string
    allowFemaleConcurrentMarriages?: boolean
    debugMode?: boolean
    /** When true, non-polygamous families are included in the output as `monogamousData`. */
    includeMonogamous?: boolean
}

export interface PatriarchData {
    patriarchTimeline: PatriarchTimeline
    timelines: Timeline[]
}

export interface TimelinesOutput {
    chartData: Record<string, PatriarchData>
    /** Populated when `includeMonogamous` is true. Maps patriarch name to family data for non-polygamous families. */
    monogamousData: Record<string, PatriarchData>
    stats: Statistics
    errors: any
}

export const getTimelines = ({
    fileContents,
    fileFormat,
    patriarchName,
    allowFemaleConcurrentMarriages,
    debugMode,
    includeMonogamous,
}: GetTimelinesProps): TimelinesOutput => {
    setConfig({ debugMode, allowFemaleConcurrentMarriages })
    const chartData: Record<string, PatriarchData> = {}
    const monogamousData: Record<string, PatriarchData> = {}
    const families = getFacts(fileContents, fileFormat, patriarchName)
    for (const family of families) {
        try {
            const patriarchDB = createKnowledgeTree(family.facts)
            const timelines = createTimeline(patriarchDB, family.patriarchName)

            let counted = false
            if (patriarchIsEligible(patriarchDB[family.patriarchName])) {
                incrementEligibilityCount()
                counted = true
            }

            if (checkIfPolygamous(timelines.wives)) {
                if (!counted) {
                    incrementIllegallyMarriedCount()
                    console.log("This patriarch married illegally:", family.patriarchName)
                }
                incrementPolygamousCount()
                chartData[family.patriarchName] = {
                    patriarchTimeline: timelines.rootTimeline,
                    timelines: timelines.wives,
                }
            } else if (includeMonogamous && timelines.wives.length > 0) {
                monogamousData[family.patriarchName] = {
                    patriarchTimeline: timelines.rootTimeline,
                    timelines: timelines.wives,
                }
            }
            incrementPatriarchCount()
        } catch (e) {
            console.error(`could not complete chart for ${family.patriarchName}`)
            console.error(e)
        }
    }
    if (debugMode && !patriarchName) {
        console.log(`\nfound ${Object.keys(chartData).length} polygamous families`)
    }
    return { chartData, monogamousData, stats: reportStats(), errors: UserIntervention.getIssues() }
}

export const timelinesToMermaid = (chartData: Record<string, PatriarchData>): Record<string, string> => {
    const charts: Record<string, string> = {}
    for (const [name, data] of Object.entries(chartData)) {
        charts[name] = charting.createChart({ rootTimeline: data.patriarchTimeline, wives: data.timelines })
    }
    return charts
}
