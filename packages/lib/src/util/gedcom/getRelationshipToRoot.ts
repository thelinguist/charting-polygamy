import { GedcomEntity, GedcomTree, GedcomType } from "../../types"
import { GedcomDatabase } from "./database"
import { getMatriarchFromFamily, getPatriarchFromFamily } from "./queries"

export const findRootPersonId = (treeChildren: GedcomTree["children"]): string | undefined => {
    const head = treeChildren.find(r => r.type === GedcomType.Head)
    if (head) {
        const rootTag = head.children.find(c => c.type === "_ROOT" || c.type === "_HME")
        if (rootTag?.data?.pointer) return rootTag.data.pointer
    }
    const firstIndi = treeChildren.find(r => r.type === GedcomType.Individual)
    return (firstIndi as GedcomEntity | undefined)?.data.xref_id
}

type Step = { up: boolean; step: boolean }

const stepsToRelationshipLabel = (steps: Step[]): string => {
    const isStep = steps.some(s => s.step)
    const prefix = isStep ? "Step-" : ""

    const upCount = steps.filter(s => s.up).length
    const downCount = steps.filter(s => !s.up).length

    // Direct ancestor (all up)
    if (downCount === 0) {
        if (upCount === 0) return "Root"
        if (upCount === 1) return `${prefix}Father`
        if (upCount === 2) return `${prefix}Grandfather`
        const greats = "Great-".repeat(upCount - 2)
        return `${prefix}${greats}Grandfather`
    }

    // Collateral (k ups then 1 down)
    if (downCount === 1) {
        if (upCount === 1) return `${prefix}Brother`
        if (upCount === 2) return `${prefix}Uncle`
        if (upCount === 3) return `${prefix}Great-Uncle`
        const greats = "Great-".repeat(upCount - 3)
        return `${prefix}${greats}Great-Uncle`
    }

    // Complex collateral
    return `${prefix}Distant Relative`
}

export const getRelationshipToRoot = (
    database: GedcomDatabase,
    rootId: string,
    targetId: string
): string | undefined => {
    if (rootId === targetId) return "Root"

    type Node = { id: string; steps: Step[] }
    const visited = new Set<string>()
    const queue: Node[] = [{ id: rootId, steps: [] }]
    const MAX_DEPTH = 20

    while (queue.length > 0) {
        const { id, steps } = queue.shift()!
        if (visited.has(id)) continue
        visited.add(id)

        if (id === targetId) return stepsToRelationshipLabel(steps)
        if (steps.length >= MAX_DEPTH) continue

        const individual = database.individual[id]
        if (!individual) continue

        for (const fact of individual.children) {
            // Go UP: FAMC → family → parents
            if (fact.type === GedcomType.FamilyChildRelation) {
                const familyId = (fact as any).data?.pointer
                if (!familyId) continue
                const family = database.families[familyId]
                if (!family) continue

                const isStep = fact.children?.some(
                    (c: any) => c.type === "PEDI" && c.value === "step"
                ) ?? false

                const father = getPatriarchFromFamily(database, family)
                if (father && !visited.has(father.data.xref_id)) {
                    queue.push({
                        id: father.data.xref_id,
                        steps: [...steps, { up: true, step: isStep }],
                    })
                }
                const mother = getMatriarchFromFamily(database, family)
                if (mother && !visited.has(mother.data.xref_id)) {
                    queue.push({
                        id: mother.data.xref_id,
                        steps: [...steps, { up: true, step: isStep }],
                    })
                }
            }

            // Go DOWN: FAMS → family → children
            if (fact.type === GedcomType.FamilySpouseRelation) {
                const familyId = (fact as any).data?.pointer
                if (!familyId) continue
                const family = database.families[familyId]
                if (!family) continue

                for (const child of family.children) {
                    if (child.type === GedcomType.Child) {
                        const childId = (child as any).data?.pointer
                        if (childId && !visited.has(childId)) {
                            queue.push({
                                id: childId,
                                steps: [...steps, { up: false, step: false }],
                            })
                        }
                    }
                }
            }
        }
    }

    return undefined
}