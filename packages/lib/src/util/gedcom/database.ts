import {
    FamilyRecord,
    GedcomIndividual,
    GedcomSource,
    GedcomTree,
    GedcomType,
} from "../../types"

export interface GedcomDatabase {
    families: Record<string, FamilyRecord>
    individual: Record<string, GedcomIndividual>
    sources: Record<string, GedcomSource>
}
export const mapDatabase = (tree: GedcomTree["children"]): GedcomDatabase => {
    const db = {
        families: {},
        individual: {},
        sources: {},
    }
    for (const record of tree) {
        if (!record.data.xref_id) {
            if (
                record.type !== GedcomType.Head &&
                record.type !== GedcomType.Trailer
            ) {
                console.warn("found a record without an xref_id")
            }
            continue
        }
        if (record.type === GedcomType.Family) {
            db.families[record.data.xref_id] = record
        }
        if (record.type === GedcomType.Individual) {
            db.individual[record.data.xref_id] = record
        }
    }
    return db
}
