import { KnowledgeTree, OtherMarriage } from "../../types"
import { getMarriageEnd } from "../../util/get-marriage-end"
import { UserIntervention } from "../../util/user-intervention"

export const getOtherMarriages = (tree: KnowledgeTree, wife: string, rootNode): OtherMarriage[] => {
    const otherMarriages: OtherMarriage[] = []
    for (const otherHusband in tree[wife].marriages) {
        if (otherHusband !== rootNode) {
            const start = tree[wife].marriages[otherHusband].date
            if (!start) {
                continue
            }
            const end = getMarriageEnd(tree, wife, otherHusband)
            if (!end) {
                UserIntervention.addIssue({
                    fact: { Name: wife },
                    issueWith: "Date",
                    reason: `could not determine end date for marriage between ${wife} and ${otherHusband}`,
                })
                continue
            }
            otherMarriages.push({
                start,
                spouse: otherHusband,
                end,
            })
        }
    }
    return otherMarriages
}
