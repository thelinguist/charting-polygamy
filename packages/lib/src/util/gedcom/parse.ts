import { PatriarchalFamily, FactRecord, GedcomTree } from "../../types"
import { parse } from "parse-gedcom"
import { mapDatabase } from "./database"
import { dedupeFacts } from "../dedupe"
import { getFamilies } from "./getFamilies"
import { findRootPersonId, getRelationshipToRoot } from "./getRelationshipToRoot"

export const parseGedcom = (fileContents: string, patriarchToFind?: string): PatriarchalFamily[] => {
    const records = parse(fileContents) as GedcomTree
    const rootId = findRootPersonId(records.children)
    const database = mapDatabase(records.children)
    const familiesByPatriarch = getFamilies(database, patriarchToFind)

    // deduplicating required cuz for each family the patriarch facts are added.
    // An improvement would be to make a list of identities to get, and get them after getting the relationship facts
    return Object.keys(familiesByPatriarch).map(patriarchId => ({
        facts: dedupeFacts<FactRecord>(familiesByPatriarch[patriarchId].families.flat()),
        patriarchName: familiesByPatriarch[patriarchId].name,
        patriarchId: patriarchId,
        relationshipToRoot: rootId ? getRelationshipToRoot(database, rootId, patriarchId) : undefined,
    }))
}
