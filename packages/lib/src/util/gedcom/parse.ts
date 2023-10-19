import { PatriarchalFamily, FactRecord, GedcomTree } from "../../types"
import { parse } from "parse-gedcom"
import { mapDatabase } from "./database"
import { dedupeFacts } from "../dedupe"
import { getFamilies } from "./getFamilies"

export const parseGedcom = (
    fileContents: string,
    patriarchToFind?: string,
): PatriarchalFamily[] => {
    const records = parse(fileContents) as GedcomTree
    const database = mapDatabase(records.children)
    // const database = pl.DataFrame(records.children)
    // database.describe()
    const data = getFamilies(database, patriarchToFind)

    // deduplicating required cuz for each family the patriarch facts are added.
    // An improvement would be to make a list of identities to get, and get them after getting the relationship facts
    return Object.keys(data).map((name) => ({
        facts: dedupeFacts<FactRecord>(data[name].families.flat()),
        patriarchName: name,
    }))
}
