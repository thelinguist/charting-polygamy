import { FileTypes, Statistics } from "./types"
import { createKnowledgeTree } from "./steps/createKnowledgeTree"
import { createTimeline } from "./steps/createTimeline"
import { charting, setConfig } from "./util"
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

interface Props {
    fileContents: string
    fileFormat: FileTypes
    patriarchName?: string
    allowFemaleConcurrentMarriages?: boolean
    debugMode?: boolean
}

interface Output {
    charts: {
        [patriarchName: string]: string
    }
    stats: Statistics
}
export const getTimelinesForMermaid = ({
    fileContents,
    fileFormat,
    patriarchName,
    allowFemaleConcurrentMarriages,
    debugMode,
}: Props): Output => {
    setConfig({ debugMode, allowFemaleConcurrentMarriages })
    const charts: Record<string, string> = {}
    const families = getFacts(fileContents, fileFormat, patriarchName)
    // console.log(UserIntervention.getIssues())
    for (const family of families) {
        try {
            // TODO createKnowledgeTree should determine the marriage end (and reason). then checkIfPolygamous should be done earlier
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
                charts[family.patriarchName] = charting.createChart(timelines)
            }
            incrementPatriarchCount()
        } catch (e) {
            console.error(`could not complete chart for ${family.patriarchName}`)
            console.error(e)
        }
    }
    if (debugMode && !patriarchName) {
        console.log(`\nfound ${Object.keys(charts).length} polygamous families`)
    }
    return { charts, stats: reportStats() }
}
