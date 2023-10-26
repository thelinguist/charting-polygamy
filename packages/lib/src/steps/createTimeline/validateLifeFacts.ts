import { KnowledgeTree } from "../../types"

export const validateLifeFacts = (tree: KnowledgeTree, person: string) => {
    if (!tree[person]?.birth?.date) {
        console.error(`${person} does not have a birthdate, skipping`)
        return false
    }
    if (isNaN(tree[person].birth!.date!.getTime())) {
        console.error(`${person} does not have a valid birthdate, skipping`)
        return false
    }
    if (!tree[person]?.death?.date) {
        console.error(`${person} does not have a death date, skipping`)
        return false
    }
    if (isNaN(tree[person].death!.date!.getTime())) {
        console.error(`${person} does not have a valid death date, skipping`)
        return false
    }
    return true
}
