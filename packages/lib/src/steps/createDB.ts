import { PatriarchalFamily, FileTypes } from "../types"
import { parseCsv, parseGedcom } from "../util"

export const getFacts = (
    fileContent: string,
    format: FileTypes,
    patriarchName?: string,
): PatriarchalFamily[] => {
    if (format === FileTypes.ged) {
        return parseGedcom(fileContent, patriarchName)
    } else if (format === FileTypes.csv && patriarchName) {
        return [
            {
                facts: parseCsv(fileContent),
                patriarchName,
            },
        ]
    }
    throw new Error("could not find any facts from the files given")
}
