import { KnowledgeTree, LifeEventEnum } from "../types"
import { isAfter, isBefore, isSameDay } from "date-fns"
import { UserIntervention } from "./user-intervention"
import { getConfig } from "./config"

// TODO write tests for when no divorce, when husband dies, and when she leaves one man and marries another then another before the man she left dies
export const getMarriageEnd = (tree: KnowledgeTree, wife: string, spouse: string) => {
    const wifesDeath = tree[wife].death?.date
    if (!wifesDeath) {
        console.error(`missing ${wife} death info, skipping`)
        return
    }

    if (tree[wife].marriages) {
        // sort marriages by start time.
        const sortedMarriages = Object.values(tree[wife].marriages).sort((marriageA, marriageB) => {
            if (!marriageA.date && !marriageB.date) return 0
            if (!marriageA.date) return 1
            if (!marriageB.date) return -1
            return marriageA.date.getTime() - marriageB.date.getTime()
        })

        for (let i = 0; i < sortedMarriages.length; i++) {
            const marriage = sortedMarriages[i]
            if (marriage.person !== spouse) {
                continue
            }
            const husband = marriage.person

            // ends if there is a divorce
            if (tree[wife].divorces[husband]?.date) {
                return tree[wife].divorces[husband].date
            }

            // if last marriage, pick the death date
            const subsequentMarriage = sortedMarriages[i + 1]
            const husbandDeath = tree[husband].death?.date
            if (!subsequentMarriage) {
                if (!wifesDeath && husbandDeath) {
                    return husbandDeath
                }
                if (!husbandDeath && wifesDeath) {
                    return wifesDeath
                }
                if (!husbandDeath && !wifesDeath) {
                }
                return isBefore(wifesDeath!, husbandDeath!) ? wifesDeath : husbandDeath
            }

            // if husband dies before her next marriage, end it there
            if (husbandDeath && subsequentMarriage.date && isBefore(husbandDeath, subsequentMarriage.date)) {
                return husbandDeath
            }

            // if concurrent marriages are allowed, use the soonest death in the relationship
            if (getConfig().allowFemaleConcurrentMarriages) {
                if (!wifesDeath && husbandDeath) {
                    return husbandDeath
                }
                if (!husbandDeath && wifesDeath) {
                    return wifesDeath
                }
                if (!husbandDeath && !wifesDeath) {
                }
                return isBefore(wifesDeath!, husbandDeath!) ? wifesDeath : husbandDeath
            }

            // if husband does not die yet, and concurrent marriages aren't allowed, end the marriage with the start of the next
            return subsequentMarriage.date
        }
    }
}
