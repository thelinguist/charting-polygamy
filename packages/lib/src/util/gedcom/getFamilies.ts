import {
    FactRecord,
    GedcomFamilyRelationFact,
    GedcomIndividual,
    GedcomType,
    LifeEventEnum,
} from "../../types"
import { GedcomDatabase } from "./database"
import { gatherFacts } from "./individual"
import { UserIntervention } from "../user-intervention"
import {
    getIndividualName,
    getMatriarchFromFamily,
    getPatriarchFromFamily,
    identifyMultiPartnerPatriarchs,
} from "./queries"

interface PatriarchData {
    patriarch: GedcomIndividual
    families: FactRecord[][]
}

export const getFamilies = (
    database: GedcomDatabase,
    patriarchToFind?: string,
): Record<string, PatriarchData> => {
    const patriarchData: Record<string, PatriarchData> = {}
    const familyIds = getCandidatesFamilyIds(database)
    for (const id of familyIds) {
        const family = database.families[id]
        if (!family) {
            continue
        }
        const patriarch = getPatriarchFromFamily(database, family)
        if (!patriarch) {
            console.warn(`the family ${id} has no husband, skipping`)
            continue
        }
        const patriarchName = getIndividualName(patriarch)
        if (!patriarchName) {
            console.warn(`the family ${id} has no name for husband, skipping`)
            continue
        }
        if (
            patriarchToFind &&
            patriarchName.toLowerCase() !== patriarchToFind.toLowerCase()
        ) {
            continue
        }

        const matriarch = getMatriarchFromFamily(database, family)
        if (!matriarch) {
            console.warn(
                `the family of ${patriarchName}, ${id}, has no wife, skipping`,
            )
            continue
        }
        if (patriarchName && !patriarchData[patriarchName]) {
            patriarchData[patriarchName] = {
                patriarch,
                families: [],
            }
        }
        const matriarchName = getIndividualName(matriarch)
        if (!matriarchName) {
            console.warn(`the family ${id} has no name for wife, skipping`)
            continue
        }

        const factsAboutFamily: FactRecord[] = []

        factsAboutFamily.push(
            ...gatherFacts(
                patriarch,
                patriarchName,
                matriarchName,
                family,
                true,
            ),
        )
        factsAboutFamily.push(
            ...processOtherFamilies(matriarch, matriarchName, database, id),
        )
        factsAboutFamily.push(
            ...gatherFacts(
                matriarch,
                matriarchName,
                patriarchName,
                family,
                false,
            ),
        )

        const marriageRecordMissing = !factsAboutFamily.find(
            (fact) =>
                fact.Event === LifeEventEnum.Marriage &&
                fact.Name === patriarchName &&
                fact["Second Party"] === matriarchName,
        )

        if (marriageRecordMissing) {
            UserIntervention.addIssue({
                fact: {},
                issueWith: "Event",
                reason: `no marriage data found for ${patriarchName} & ${matriarchName}. This marriage will be skipped in the output`,
            })
            factsAboutFamily.push({
                Name: patriarchName,
                "Second Party": matriarchName,
                Event: LifeEventEnum.Marriage,
            })
        }

        patriarchData[patriarchName].families.push(factsAboutFamily)
    }
    return patriarchData
}

/**
 * gets ids from families with a father who has/had more than one partner
 * @param database
 */
const getCandidatesFamilyIds = (database: GedcomDatabase) => {
    const multiPartnerPatriarchs = Object.values(database.individual).filter(
        identifyMultiPartnerPatriarchs,
    )
    return multiPartnerPatriarchs
        .map((individual) =>
            individual.children
                .filter((fact) => fact.type === GedcomType.FamilySpouseRelation)
                .map(
                    (fact) =>
                        (fact as unknown as GedcomFamilyRelationFact).data
                            .pointer,
                ),
        )
        .flat()
}

const processOtherFamilies = (
    matriarch: GedcomIndividual,
    matriarchName: string,
    database,
    familyId: string,
): FactRecord[] => {
    const matriarchUnions = matriarch.children.filter(
        (fact) => fact.type === GedcomType.FamilySpouseRelation,
    )
    if (matriarchUnions.length > 1) {
        const otherFamiliesFacts: FactRecord[] = []

        for (const union of matriarchUnions) {
            const otherFamilyId = union.data.pointer
            if (otherFamilyId && otherFamilyId !== familyId) {
                const otherFamily = database.families[otherFamilyId]
                if (!otherFamily) {
                    break
                }
                const patriarch = getPatriarchFromFamily(database, otherFamily)
                if (!patriarch) {
                    console.warn(
                        `the family ${otherFamilyId} has no husband, skipping`,
                    )
                    break
                }
                const patriarchName = getIndividualName(patriarch)
                if (!patriarchName) {
                    console.warn(
                        `the family ${otherFamilyId} has no name for husband, skipping`,
                    )
                    break
                }

                otherFamiliesFacts.push(
                    ...gatherFacts(
                        patriarch,
                        patriarchName,
                        matriarchName,
                        otherFamily,
                        true,
                    ),
                )
            }
        }
        return otherFamiliesFacts
    }
    return []
}
