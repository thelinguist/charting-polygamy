import { GedcomIndividual, GedcomType, SexIdentityRecord } from "../../../types"

export const identifyMultiPartnerIndividuals = (individual: GedcomIndividual) =>
    individual.children.filter(
        (fact) => fact.type === GedcomType.FamilySpouseRelation,
    ).length > 1

export const identifyMultiPartnerPatriarchs = (
    individual: GedcomIndividual,
): boolean => {
    let numSpouseRelations = 0
    for (const fact of individual.children) {
        if (fact.type === GedcomType.Sex) {
            if ((fact as unknown as SexIdentityRecord).value !== "M")
                return false
        }
        if (fact.type === GedcomType.FamilySpouseRelation) {
            numSpouseRelations++
        }
    }
    return numSpouseRelations > 1
}

export const getIndividualFact =
    (factType: GedcomType) => (individual: GedcomIndividual) => {
        return individual.children.filter((fact) => fact.type === factType)
    }

export const getPersonFromDatabase = (
    database,
    relationRecord,
): GedcomIndividual | undefined => {
    const individualId = relationRecord?.data.pointer
    return database.individual[individualId]
}

export const getPatriarchFromFamily = (database, family) => {
    const husbandRelation = family.children.find(
        (fact) => fact.type === GedcomType.Husband,
    )
    return getPersonFromDatabase(database, husbandRelation)
}

export const getMatriarchFromFamily = (database, family) => {
    const wifeRelation = family.children.find(
        (fact) => fact.type === GedcomType.Wife,
    )
    return getPersonFromDatabase(database, wifeRelation)
}

export const getMarriage = (database, family) => {
    return family.children.find((fact) => fact.type === GedcomType.Marriage)
}

export const getIndividualName = (
    individual: GedcomIndividual,
): string | undefined => {
    const nameRecord = individual.children.find(
        (fact) => fact.type === GedcomType.Name,
    )
    if (nameRecord) {
        return (nameRecord.value ?? "").replace(/\//g, "")
    }
}

type EventTypes =
    | GedcomType.Birth
    | GedcomType.Death
    | GedcomType.Marriage
    | GedcomType.MarriageLicense
    | GedcomType.Divorce
    | GedcomType.Engagement
export const getIndividualEvent = (
    individual: GedcomIndividual,
    event: EventTypes,
) => {
    const eventRecord = individual.children.find((fact) => fact.type === event)
    if (!eventRecord) {
        return
    }
    const dateRecord = eventRecord?.children.find(
        (fact) => fact.type === GedcomType.Date,
    )
    if (!dateRecord) {
        return
    }
    return dateRecord.value
}
