import {FileTypes} from './types'
import {createKnowledgeTree} from './steps/createKnowledgeTree'
import {createTimeline} from './steps/createTimeline'
import {chart} from './steps/chart'
import {getFacts} from './steps/createDB'
import {checkIfPolygamous} from './steps/checkIfPolygamous'

export const runProgram = (fileContents: string, fileFormat: FileTypes, patriarchName?: string, debugMode?: boolean) => {
    const families = getFacts(fileContents, fileFormat, patriarchName)
    // console.log(UserIntervention.getIssues())
    let counter = 0
    for (const family of families) {
        try {
            // TODO createKnowledgeTree should determine the marriage end (and reason). then checkIfPolygamous should be done earlier
            const patriarchsDB = createKnowledgeTree(family.facts)

            const timelines = createTimeline(patriarchsDB, family.patriarchName)

            if (checkIfPolygamous(timelines.wives)) {
                counter += 1
                chart(timelines, debugMode, family.patriarchName)
            }
        } catch (e) {
            console.error(`could not complete chart for ${family.patriarchName}`)
            console.error(e)
        }
    }
    if (!patriarchName) {
        console.log(`\nfound ${counter} polygamous families`)
    }
}
