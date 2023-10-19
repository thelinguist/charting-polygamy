import {
    FactRecord,
    GedcomEntity,
    GedcomIndividual,
    GedcomType,
    LifeEventEnum,
} from "../../types"
import { dateToMMDDYYYY, parseTextDate } from "../date-tools"
import { UserIntervention } from "../user-intervention"
import { getIndividualEvent } from "./queries"

export const getBirthdate = (
    individual: GedcomIndividual,
    name,
): FactRecord | undefined => {
    const unformattedBirthday = getIndividualEvent(individual, GedcomType.Birth)
    let fact: Partial<FactRecord> = {
        Event: LifeEventEnum.Birth,
        Name: name,
    }
    if (!unformattedBirthday) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: "missing marriage date",
        })
        return
    }
    try {
        const birthday = parseTextDate(unformattedBirthday, fact)
        fact.Date = dateToMMDDYYYY(birthday)
        return fact as FactRecord
    } catch (e) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: (e as Error).message,
        })
        console.error(
            `could not parse birthday ${unformattedBirthday} for ${fact.Name}`,
        )
        console.error(e)
    }
}

export const getDeathFact = (
    individual: GedcomIndividual,
    name,
): FactRecord | undefined => {
    const unformattedDeath = getIndividualEvent(individual, GedcomType.Death)
    let fact: Partial<FactRecord> = {
        Event: LifeEventEnum.Death,
        Name: name,
    }
    if (!unformattedDeath) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: "missing death date",
        })
        return
    }
    try {
        const death = parseTextDate(unformattedDeath, fact)
        fact.Date = dateToMMDDYYYY(death)

        return fact as FactRecord
    } catch (e) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: (e as Error).message,
        })
        console.error(
            `could not parse death date ${unformattedDeath} for ${fact.Name}`,
        )
        console.error(e)
    }
}

const getMarriageStart = (family, patriarchName, matriarchName) => {
    let unformattedMarriageDate =
        getIndividualEvent(family, GedcomType.Marriage) ??
        getIndividualEvent(family, GedcomType.MarriageLicense) ??
        getIndividualEvent(family, GedcomType.Engagement)
    let fact: Partial<FactRecord> = {
        Event: LifeEventEnum.Marriage,
        Name: patriarchName,
        "Second Party": matriarchName,
    }
    if (!unformattedMarriageDate) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: "missing marriage date",
        })
        return
    }
    try {
        const marriage = parseTextDate(unformattedMarriageDate, fact)
        fact.Date = dateToMMDDYYYY(marriage)

        return fact as FactRecord
    } catch (e) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: (e as Error).message,
        })
        console.error(
            `could not parse marriage date: ${unformattedMarriageDate} for ${fact.Name}`,
        )
        console.error(e)
    }
}

const getDivorce = (family, patriarchName, matriarchName) => {
    const unformattedDivorceDate = getIndividualEvent(
        family,
        GedcomType.Divorce,
    )

    if (!unformattedDivorceDate) {
        return
    }

    let fact: Partial<FactRecord> = {
        Event: LifeEventEnum.Divorce,
        Name: patriarchName,
        "Second Party": matriarchName,
    }
    try {
        const divorce = parseTextDate(unformattedDivorceDate, fact)
        fact.Date = dateToMMDDYYYY(divorce)

        return fact as FactRecord
    } catch (e) {
        UserIntervention.addIssue({
            fact,
            issueWith: "Date",
            reason: (e as Error).message,
        })
        console.error(`could not parse divorce date for ${fact.Name}`)
        console.error(e)
    }
}

const processDuplicates = (facts: FactRecord[]): FactRecord[] => {
    const dedupedFacts: any = {}
    for (const fact of facts) {
        if (fact.Event === LifeEventEnum.Birth) {
            if (!dedupedFacts.birth) {
                dedupedFacts.birth = fact
            } else if (dedupedFacts.birth.Date !== fact.Date) {
                UserIntervention.addIssue({
                    fact,
                    issueWith: "Event",
                    reason: `found differing dates for birth: ${dedupedFacts.birth.Date} & ${fact.Date}. assuming the first one`,
                })
            }
        } else if (fact.Event === LifeEventEnum.Death) {
            if (!dedupedFacts.death) {
                dedupedFacts.death = fact
            } else if (dedupedFacts.death.Date !== fact.Date) {
                UserIntervention.addIssue({
                    fact,
                    issueWith: "Event",
                    reason: `found differing dates for death: ${dedupedFacts.death.Date} & ${fact.Date}. assuming the first one`,
                })
            }
        } else if (fact.Event === LifeEventEnum.Marriage) {
            if (!dedupedFacts.marriage) {
                dedupedFacts.marriage = fact
            } else if (dedupedFacts.marriage.Date !== fact.Date) {
                UserIntervention.addIssue({
                    fact,
                    issueWith: "Event",
                    reason: `found differing dates for marriage: ${dedupedFacts.marriage.Date} & ${fact.Date}. assuming the first one`,
                })
            }
        }
    }
    return Object.values(dedupedFacts)
}

export const gatherFacts = (
    individual: GedcomIndividual,
    name: string,
    spouseName: string,
    family: GedcomEntity,
    gatherMarriageDetails: boolean,
) => {
    const facts: FactRecord[] = []
    if (!individual) {
        return facts
    }
    const birthdayFact = getBirthdate(individual, name)
    if (birthdayFact) {
        facts.push(birthdayFact)
    }
    const deathFact = getDeathFact(individual, name)
    if (deathFact) {
        facts.push(deathFact)
    }
    if (gatherMarriageDetails) {
        const marriage = getMarriageStart(family, name, spouseName)
        if (marriage) {
            facts.push(marriage)
        }
        const divorce = getDivorce(family, name, spouseName)
        if (divorce) {
            facts.push(divorce)
        }
    }
    return processDuplicates(facts)
}
