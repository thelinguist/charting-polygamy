import { PatriarchalFamily, FileTypes } from "../types"
import { parseCsv, parseGedcom } from "../util"

export const getFacts = (fileContent: string, format: FileTypes, patriarchName?: string): PatriarchalFamily[] => {
    if (format === FileTypes.ged) {
        return parseGedcom(fileContent, patriarchName)
    } else if (format === FileTypes.csv) {
        const facts = parseCsv(fileContent)
        if (!patriarchName) {
            if (facts.length === 0) {
                return []
            }
            console.info("No patriarch specified, assuming first record in CSV is the patriarch.")
            patriarchName ??= facts[0].Name
        }
        return [
            {
                facts,
                patriarchName,
            },
        ]
    }
    throw new Error("could not find any facts from the files given")
}
