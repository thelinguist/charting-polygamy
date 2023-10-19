import {
    KnowledgeTree,
    OtherMarriage,
    PatriarchTimeline,
    PersonDetails,
    Timeline,
} from "../types"

import { differenceInYears } from "date-fns"
import { getMarriageEnd } from "../util/get-marriage-end"

const validateLifeFacts = (tree, person) => {
    if (!tree[person] || !tree[person].birth?.date) {
        console.error(`${person} does not have a birthdate, skipping`)
        return false
    }
    if (!tree[person] || !tree[person].death?.date) {
        console.error(`${person} does not have a death date, skipping`)
        return false
    }
    return true
}

const getMarriageAgeGap = (person: PersonDetails, spouse: PersonDetails) => {
    const marriage = person.marriages[spouse.name]
    const birth = person.birth?.date
    const spouseBirth = spouse.birth?.date
    if (!birth || !spouseBirth || !marriage?.date) {
        console.warn(
            `${person.name} is missing dates for marriage with ${spouse.name}`,
        )
        return {}
    }
    const age = differenceInYears(marriage?.date, birth)
    const gap = differenceInYears(spouseBirth, birth)
    return {
        age,
        gap,
        start: marriage.date,
    }
}

const getOtherMarriages = (
    tree: KnowledgeTree,
    wife: string,
    rootNode,
): OtherMarriage[] => {
    const otherMarriages: OtherMarriage[] = []
    for (const otherHusband in tree[wife].marriages) {
        if (otherHusband !== rootNode) {
            const start = tree[wife].marriages[otherHusband].date
            const otherMarriage = {
                start,
                spouse: otherHusband,
                end: getMarriageEnd(tree, wife, otherHusband),
            } as OtherMarriage
            if (!otherMarriage.end) {
                console.error(
                    `missing end date for ${wife}->${otherHusband}. marking end date as start date`,
                )
                otherMarriage.end = start!
            }
            otherMarriages.push(otherMarriage)
        }
    }
    return otherMarriages
}

const getWives = (tree: KnowledgeTree, patriarch: string): Timeline[] => {
    const timelines: Timeline[] = []
    for (const wife in tree[patriarch].marriages) {
        if (!validateLifeFacts(tree, wife)) {
            continue
        }
        const timeline = {
            name: wife,
            birth: tree[wife].birth!.date!,
            death: tree[wife].death!.date!,
            linkedMarriage: {
                start: tree[patriarch].marriages[wife].date!,
                end: undefined,
            },
        } as Timeline
        timeline.linkedMarriage.end = getMarriageEnd(tree, wife, patriarch)
        if (!timeline.linkedMarriage.end) {
            console.error(
                `${wife} does not have an end date for their marriage, skipping`,
            )
            continue
        }

        const { age, gap } = getMarriageAgeGap(tree[wife], tree[patriarch])
        timeline.age = age
        timeline.gap = gap

        timeline.otherMarriages = getOtherMarriages(tree, wife, patriarch).sort(
            (marriageA, marriageB) =>
                marriageA.start.getTime() - marriageB.start.getTime(),
        )
        timelines.push(timeline)
    }
    return timelines
}

export const createTimeline = (
    tree: KnowledgeTree,
    patriarch,
): { rootTimeline: PatriarchTimeline; wives: Timeline[] } => {
    if (!validateLifeFacts(tree, patriarch)) {
        throw new Error(`could not validate facts for ${patriarch}`)
    }
    const birth = tree[patriarch].birth!.date!
    const rootTimeline: PatriarchTimeline = {
        name: tree[patriarch].name,
        birth,
        death: tree[patriarch].death!.date!,
        marriages: Object.values(tree[patriarch].marriages)
            .map((marriage) =>
                getMarriageAgeGap(tree[patriarch], tree[marriage.person]),
            )
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
        return (
            wifeA.linkedMarriage.start.getTime() -
            wifeB.linkedMarriage.start.getTime()
        )
    })

    return { rootTimeline, wives }
}
