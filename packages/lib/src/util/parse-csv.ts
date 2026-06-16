import csv from "papaparse"
import { FactRecord } from "../types"

const isNonEmpty = (value: unknown): boolean => {
    return typeof value === "string" && value.trim().length > 0
}

export const parseCsv = (fileContents: string): FactRecord[] => {
    const records = csv.parse(fileContents, { header: true })
    return records.data.filter(
        (row) => isNonEmpty(row["Name"]) && isNonEmpty(row["Event"]) && isNonEmpty(row["Date"])
    ) as FactRecord[]
}
