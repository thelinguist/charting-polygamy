import {KnowledgeTree, LifeEventEnum} from '../types'
import {isAfter, isBefore, isSameDay} from 'date-fns'
import {UserIntervention} from './user-intervention'

// TODO write tests for when no divorce, when husband dies, and when she leaves one man and marries another then another before the man she left dies
export const getMarriageEnd = (tree: KnowledgeTree, wife, husband) => {
    const wifesDeath = tree[wife].death?.date
    if (!wifesDeath) {
        console.error(`missing ${wife} death info, skipping`)
        return
    }
    if (!tree[husband]) {
        console.error(`missing ${husband} birth and death info, skipping`)
        return
    }
    const divorceEvent = tree[wife].divorces[husband]
    if (divorceEvent) {
        return divorceEvent.date
    }

    const husbandsDeath = tree[husband].death?.date

    // were there any marriages that interrupted the one being compared?
    if (tree[wife].marriages) {
        // if she moved on (married someone before the death of that husband)
        // the end of the marriage is the beginning of the next marriage (that is after this one.
        const marriagesToCompare = Object.values(tree[wife].marriages).sort((marriageA, marriageB) => {
            if (!marriageA.date && !marriageB.date) return 0
            if (!marriageA.date) return 1
            if (!marriageB.date) return -1
            return marriageA.date.getTime() - marriageB.date.getTime()
        })
        const marriageInQuestion = tree[wife].marriages[husband]
        for (const otherMarriage of marriagesToCompare) {
            if (otherMarriage.person === husband || !otherMarriage.date || !marriageInQuestion.date) {
                continue
            }
            if (isAfter(otherMarriage.date, marriageInQuestion.date)) {
                if (tree[husband].death?.date && isAfter(marriageInQuestion.date, tree[husband].death!.date!)) {
                    return tree[husband].death!.date
                }
                return otherMarriage.date
            }
        }
        // if no other marriages found afterwards, end marriage at earliest of: wife's death, husbands death.

    }


    if (!husbandsDeath) {
        UserIntervention.addIssue({
            fact: { Event: LifeEventEnum.Marriage, Name: husband, 'Second Party': wife },
            issueWith: 'Date',
            reason: `no death date given for ${husband}, assuming marriage end when wife died`,
            canMakeAssumption: true
        })
        return wifesDeath
    }


    if (isBefore(wifesDeath, husbandsDeath)) {
        // she died before he did, so that is the end for her
        return wifesDeath
    }
    if (isAfter(wifesDeath, husbandsDeath)) {
        // she was "faithful"
        return husbandsDeath
    }
    if (isSameDay(wifesDeath, husbandsDeath)) {
        return husbandsDeath
    }
}
