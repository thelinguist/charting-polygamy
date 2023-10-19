import { getConfig } from "./config"

function checkIfKeysExistAndDiffer<T = object>(deduped: T, fact: T) {
    let isDifferent = false
    for (const key in deduped) {
        if (!deduped[key]) {
            isDifferent = true
        }
        if (deduped[key] !== fact[key]) {
            isDifferent = true
        }
    }
    return isDifferent
}

/**
 * compare each item in the list against the rest for:
 * keys that don't exist object B
 * keys that don't exist in object A
 * keys that do not have the same value
 * @param facts
 */
export const dedupeFacts = <T = object>(facts: T[]): T[] => {
    const cleaned: T[] = []
    for (const fact of facts) {
        let canAdd = true
        for (const deduped of cleaned) {
            let different = false
            for (const key in fact) {
                if (!deduped[key]) {
                    different = true
                }
            }
            if (!different && !checkIfKeysExistAndDiffer<T>(deduped, fact)) {
                canAdd = false
                break
            }
        }
        if (canAdd) {
            cleaned.push(fact)
        }
    }
    if (getConfig().debugMode && facts.length !== cleaned.length) {
        console.info(
            `deduped. before: ${facts.length}, after: ${cleaned.length}`,
        )
    }
    return cleaned
}
