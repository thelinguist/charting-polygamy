import { KnowledgeTree, Timeline } from "../../types"
import { validateLifeFacts } from "./validateLifeFacts"
import { getMarriageEnd } from "../../util/get-marriage-end"
import { getOtherMarriages } from "./getOtherMarriages"
import { getMarriageAgeGap } from "./getMarriageAgeGap"

export const getWives = (tree: KnowledgeTree, patriarch: string): Timeline[] => {
    const timelines: Timeline[] = []
    for (const wife in tree[patriarch].marriages) {
        if (!validateLifeFacts(tree, wife)) {
            continue
        }
        const timeline = {
            name: wife,
            birth: tree[wife].birth!.date,
            death: tree[wife].death!.date,
            linkedMarriage: {
                start: tree[patriarch].marriages[wife].date,
                end: undefined,
            },
        } as Timeline
        timeline.linkedMarriage.end = getMarriageEnd(tree, wife, patriarch)
        if (!timeline.linkedMarriage.end) {
            console.error(`${wife} does not have an end date for their marriage, skipping`)
            continue
        }

        const { age, gap } = getMarriageAgeGap(tree[wife], tree[patriarch])
        timeline.age = age
        timeline.gap = gap

        timeline.otherMarriages = getOtherMarriages(tree, wife, patriarch).sort(
            (marriageA, marriageB) => marriageA.start.getTime() - marriageB.start.getTime()
        )
        timelines.push(timeline)
    }
    return timelines
}
