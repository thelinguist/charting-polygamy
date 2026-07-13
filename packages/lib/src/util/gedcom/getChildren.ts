import { ChildRecord, FamilyRecord, GedcomIndividual, GedcomType } from "../../types"
import { parseTextDate } from "../date-tools"
import { GedcomDatabase } from "./database"
import { getIndividualName } from "./queries"

function getBirthFromIndividual(individual: GedcomIndividual): Date | undefined {
    const birthRecord = individual.children.find(f => f.type === GedcomType.Birth)
    if (!birthRecord) return undefined
    const dateRecord = birthRecord.children.find(f => f.type === GedcomType.Date)
    if (!dateRecord?.value) return undefined
    try {
        return parseTextDate(dateRecord.value, {})
    } catch {
        return undefined
    }
}

function getChildrenFromFamily(database: GedcomDatabase, family: FamilyRecord): ChildRecord[] {
    const records: ChildRecord[] = []
    for (const fact of family.children) {
        if (fact.type !== GedcomType.Child) continue
        const pointer = (fact as any).data?.pointer
        if (!pointer) continue
        const individual = database.individual[pointer]
        if (!individual) continue
        const name = getIndividualName(individual)
        if (!name) continue
        records.push({ name, birth: getBirthFromIndividual(individual) })
    }
    return records
}

/**
 * Returns children for a given family, with one level of grandchildren resolved.
 * Each ChildRecord's `children` field contains grandchildren (children of that child
 * who appear as a child in any family where the child is a spouse).
 */
export function getChildrenForFamily(database: GedcomDatabase, family: FamilyRecord): ChildRecord[] {
    const children = getChildrenFromFamily(database, family)

    for (const child of children) {
        const childIndividual = Object.values(database.individual).find(ind => getIndividualName(ind) === child.name)
        if (!childIndividual) continue

        const grandchildren: ChildRecord[] = []
        for (const fact of childIndividual.children) {
            if (fact.type !== GedcomType.FamilySpouseRelation) continue
            const familyPointer = (fact as any).data?.pointer
            if (!familyPointer) continue
            const childFamily = database.families[familyPointer]
            if (!childFamily) continue
            grandchildren.push(...getChildrenFromFamily(database, childFamily))
        }

        if (grandchildren.length > 0) {
            child.children = grandchildren
        }
    }

    return children
}
