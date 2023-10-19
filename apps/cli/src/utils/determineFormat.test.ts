import { describe, expect, it } from "vitest"
import { determineFormat } from "./determineFormat"
import { FileTypes } from "lib/src/types"

describe("determineFormat", () => {
    it("determines gedcom based on file", () => {
        expect(determineFormat(undefined, "file.ged")).toBe(FileTypes.ged)
    })

    it("determines csv based on file", () => {
        expect(determineFormat(undefined, "file.csv")).toBe(FileTypes.csv)
    })

    it("uses param to determine file type", () => {
        expect(determineFormat(FileTypes.csv, "file.tsv")).toBe(FileTypes.csv)
    })
})
