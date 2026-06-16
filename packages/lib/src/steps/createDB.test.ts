import { describe, it, expect } from "vitest"
import { getFacts } from "./createDB"
import { FileTypes, LifeEventEnum } from "../types"

const CSV_HEADER = "Name,Event,Date,Second Party"

const buildCsvRow = (name: string, event: string, date: string, secondParty?: string) => {
    const sp = secondParty ?? ""
    return `${name},${event},${date},${sp}`
}

const VALID_CSV = [
    CSV_HEADER,
    buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
    buildCsvRow("John Smith", LifeEventEnum.Marriage, "1862-06-15", "Mary Jones"),
    buildCsvRow("Mary Jones", LifeEventEnum.Birth, "1843-05-20"),
].join("\n")

const ALL_INVALID_CSV = [
    CSV_HEADER,
    buildCsvRow("", LifeEventEnum.Birth, "1840-01-01"),  // missing Name
    buildCsvRow("", LifeEventEnum.Marriage, "1862-06-15"), // missing Name
].join("\n")

describe("getFacts — CSV format", () => {
    it("returns empty array for empty CSV string without crashing", () => {
        const result = getFacts("", FileTypes.csv)
        expect(result).toEqual([])
    })

    it("returns empty array when all rows are invalid (all missing Name)", () => {
        const result = getFacts(ALL_INVALID_CSV, FileTypes.csv)
        expect(result).toEqual([])
    })

    it("uses the first row's Name as patriarchName when none is provided", () => {
        const result = getFacts(VALID_CSV, FileTypes.csv)

        expect(result).toHaveLength(1)
        expect(result[0].patriarchName).toBe("John Smith")
    })

    it("uses the explicit patriarchName when provided", () => {
        const result = getFacts(VALID_CSV, FileTypes.csv, "Custom Patriarch")

        expect(result).toHaveLength(1)
        expect(result[0].patriarchName).toBe("Custom Patriarch")
    })

    it("includes all facts in the returned family", () => {
        const result = getFacts(VALID_CSV, FileTypes.csv)

        expect(result[0].facts).toHaveLength(3)
    })
})