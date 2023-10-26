import { FileTypes } from "lib/src/types"
import * as path from "path"

export const determineFormat = (fileFormat: FileTypes | string | undefined, inputFile: string): FileTypes => {
    if (fileFormat === "ged" || (!fileFormat && path.extname(inputFile) === ".ged")) {
        return FileTypes.ged
    }
    if (fileFormat === "csv" || (!fileFormat && path.extname(inputFile) === ".csv")) {
        return FileTypes.csv
    }
    throw new Error("could not determine format to read family tree")
}
