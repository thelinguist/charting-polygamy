import { describe, it, expect } from "vitest"
import { parseCsv } from "./parse-csv"
import { LifeEventEnum } from "../types"

const buildCsvRow = (name: string, event: string, date: string, secondParty?: string) => {
    const sp = secondParty ?? ""
    return `${name},${event},${date},${sp}`
}

const CSV_HEADER = "Name,Event,Date,Second Party"

describe("parseCsv", () => {
    it("returns correct FactRecord array for a valid CSV", () => {
        const csv = [
            CSV_HEADER,
            buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
            buildCsvRow("John Smith", LifeEventEnum.Marriage, "1862-06-15", "Mary Jones"),
        ].join("\n")

        const result = parseCsv(csv)

        expect(result).toHaveLength(2)
        expect(result[0].Name).toBe("John Smith")
        expect(result[0].Event).toBe(LifeEventEnum.Birth)
        expect(result[0].Date).toBe("1840-01-01")
        expect(result[1]["Second Party"]).toBe("Mary Jones")
    })

    it("drops a row missing Name", () => {
        const csv = [
            CSV_HEADER,
            buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
            buildCsvRow("", LifeEventEnum.Marriage, "1862-06-15"),
        ].join("\n")

        const result = parseCsv(csv)

        expect(result).toHaveLength(1)
        expect(result[0].Name).toBe("John Smith")
    })

    it("drops a row missing Event", () => {
        const csv = [
            CSV_HEADER,
            buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
            buildCsvRow("Mary Jones", "", "1862-06-15"),
        ].join("\n")

        const result = parseCsv(csv)

        expect(result).toHaveLength(1)
        expect(result[0].Name).toBe("John Smith")
    })

    it("drops a row missing Date", () => {
        const csv = [
            CSV_HEADER,
            buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
            buildCsvRow("Mary Jones", LifeEventEnum.Death, ""),
        ].join("\n")

        const result = parseCsv(csv)

        expect(result).toHaveLength(1)
        expect(result[0].Name).toBe("John Smith")
    })

    it("drops a row with whitespace-only Name", () => {
        const csv = [
            CSV_HEADER,
            buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
            buildCsvRow("   ", LifeEventEnum.Birth, "1845-03-10"),
        ].join("\n")

        const result = parseCsv(csv)

        expect(result).toHaveLength(1)
        expect(result[0].Name).toBe("John Smith")
    })

    it("returns empty array for completely empty CSV string", () => {
        const result = parseCsv("")
        expect(result).toHaveLength(0)
    })

    it("returns empty array when CSV has only the header row", () => {
        const result = parseCsv(CSV_HEADER)
        expect(result).toHaveLength(0)
    })

    it("returns only valid rows from a mix of valid and invalid rows", () => {
        const csv = [
            CSV_HEADER,
            buildCsvRow("John Smith", LifeEventEnum.Birth, "1840-01-01"),
            buildCsvRow("", LifeEventEnum.Marriage, "1862-06-15"),        // missing Name
            buildCsvRow("Mary Jones", "", "1845-03-10"),                   // missing Event
            buildCsvRow("Jane Doe", LifeEventEnum.Death, ""),              // missing Date
            buildCsvRow("Valid Person", LifeEventEnum.Death, "1900-12-31"),
        ].join("\n")

        const result = parseCsv(csv)

        expect(result).toHaveLength(2)
        expect(result[0].Name).toBe("John Smith")
        expect(result[1].Name).toBe("Valid Person")
    })
})