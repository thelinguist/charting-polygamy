import { KnowledgeTree, OtherMarriage } from "../../types"
import { getMarriageEnd } from "../../util/get-marriage-end"

export const getOtherMarriages = (tree: KnowledgeTree, wife: string, rootNode): OtherMarriage[] => {
    const otherMarriages: OtherMarriage[] = []
    for (const otherHusband in tree[wife].marriages) {
        if (otherHusband !== rootNode) {
            const start = tree[wife].marriages[otherHusband].date
            if (!start) {
                continue
            }
            const otherMarriage = {
                start,
                spouse: otherHusband,
                end: getMarriageEnd(tree, wife, otherHusband),
            } as OtherMarriage
            if (!otherMarriage.end) {
                console.error(`missing end date for ${wife}->${otherHusband}. marking end date as start date`)
                otherMarriage.end = start!
            }
            otherMarriages.push(otherMarriage)
        }
    }
    return otherMarriages
}
