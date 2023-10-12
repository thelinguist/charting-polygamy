import {FileTypes} from './types'
import {createKnowledgeTree} from './steps/createKnowledgeTree'
import {createTimeline} from './steps/createTimeline'
import {charting} from './util'
import {getFacts} from './steps/createDB'
import {checkIfPolygamous} from './steps/checkIfPolygamous'

export const getTimelinesForMermaid = (fileContents: string, fileFormat: FileTypes, patriarchName?: string, debugMode?: boolean) => {
    const charts: Record<string, string> = {}
    const families = getFacts(fileContents, fileFormat, patriarchName)
    // console.log(UserIntervention.getIssues())
    for (const family of families) {
        try {
            // TODO createKnowledgeTree should determine the marriage end (and reason). then checkIfPolygamous should be done earlier
            const patriarchsDB = createKnowledgeTree(family.facts)

            const timelines = createTimeline(patriarchsDB, family.patriarchName)

            if (checkIfPolygamous(timelines.wives)) {
                charts[family.patriarchName] = charting.createChart(timelines)
            }
        } catch (e) {
            console.error(`could not complete chart for ${family.patriarchName}`)
            console.error(e)
        }
    }
    if (debugMode && !patriarchName) {
        console.log(`\nfound ${Object.keys(charts).length} polygamous families`)
    }
    return charts
}
