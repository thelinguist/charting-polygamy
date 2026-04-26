import { KnowledgeTree, PatriarchTimeline, Timeline } from "../../types"
import { validateLifeFacts } from "./validateLifeFacts"
import { getMarriageAgeGap } from "./getMarriageAgeGap"
import { getWives } from "./getWives"

export const createTimeline = (
    tree: KnowledgeTree,
    patriarch: string
): { rootTimeline: PatriarchTimeline; wives: Timeline[] } => {
    if (!validateLifeFacts(tree, patriarch)) {
        throw new Error(`could not validate facts for ${patriarch}`)
    }

    const birth = tree[patriarch].birth!.date!
    const death = tree[patriarch].death!.date!

    const rootTimeline: PatriarchTimeline = {
        name: tree[patriarch].name,
        birth,
        death,
        marriages: Object.values(tree[patriarch].marriages)
            .map(marriage => getMarriageAgeGap(tree[patriarch], tree[marriage.person]))
            .sort((marriageA, marriageB) => {
                if (!marriageA.age && !marriageB.age) {
                    return 0
                }
                if (!marriageA.age) {
                    return 1
                }
                if (!marriageB.age) {
                    return -1
                }
                return marriageA.age - marriageB.age
            }),
    }

    // sort them for collision detection
    const wives = getWives(tree, patriarch).sort((wifeA, wifeB) => {
        if (!wifeA.linkedMarriage.start && !wifeB.linkedMarriage.start) {
            return 0
        }
        if (!wifeA.linkedMarriage.start) {
            return 1
        }
        if (!wifeB.linkedMarriage.start) {
            return -1
        }
        return wifeA.linkedMarriage.start.getTime() - wifeB.linkedMarriage.start.getTime()
    })

    return { rootTimeline, wives }
}
