import { FileTypes } from "lib/src/types"

export const getFileFormat = (file: File): FileTypes => {
    const ext = file.name.split(".").at(-1)
    if (ext === "ged") return FileTypes.ged
    if (ext === "csv") return FileTypes.csv
    const message = `invalid file type ${ext}, expected ged or csv`
    alert(message)
    throw Error(message)
}
