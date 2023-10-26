import { describe, expect, it } from "vitest"
import { selectUnique } from "../selectUnique"

describe("selectUnique", () => {
    it("selects additional records", () => {
        const old = [{ exists: true }]
        const newList = [{ exists: true }, { exists: "also true" }]
        expect(selectUnique(old, newList)).toStrictEqual([{ exists: "also true" }])
    })

    it("selects altered records", () => {
        const old = [{ exists: true }]
        const newList = [{ exists: false }, { exists: "also true" }]
        expect(selectUnique(old, newList)).toStrictEqual(newList)
    })

    it("works", () => {
        const newRecords = [
            {
                Name: "Brigham Young",
                Event: "Birth",
                Date: "1 Jun 1801",
                Place: "Whitingham, Windham, Vermont, United States",
            },
        ]
        const oldRecords = [
            {
                Name: "Brigham Young",
                Event: "Birth",
                Date: "1 Jun 1801",
                Place: "Whitingham, Windham, Vermont, United States",
                "Second Party": "",
                Link: "",
            },
        ]
        expect(selectUnique(oldRecords, newRecords)).toStrictEqual([])
    })
})
