import { describe, it, expect } from "vitest"
import { parseGedcom } from "./parse"
import { LifeEventEnum } from "../../types"

// Minimal GEDCOM helper — joins lines with \n and wraps in HEAD/TRLR
const gedcom = (...lines: string[]) =>
    ["0 HEAD", ...lines, "0 TRLR"].join("\n")

const SIMPLE_POLYGAMOUS = gedcom(
    "0 @I1@ INDI",
    "1 NAME John Doe",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Mary Smith",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1870",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Jane Brown",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1890",
    "1 FAMS @F2@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1845",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1855"
)

// Two distinct patriarchs who share the same name, each with 2 wives
const DUPLICATE_NAME = gedcom(
    "0 @I1@ INDI",
    "1 NAME John Smith",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I4@ INDI",
    "1 NAME John Smith",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1890",
    "1 FAMS @F3@",
    "1 FAMS @F4@",
    "0 @I2@ INDI",
    "1 NAME Wife One",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1870",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Wife Two",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1827",
    "1 DEAT",
    "2 DATE 1 JAN 1875",
    "1 FAMS @F2@",
    "0 @I5@ INDI",
    "1 NAME Wife Three",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1832",
    "1 DEAT",
    "2 DATE 1 JAN 1878",
    "1 FAMS @F3@",
    "0 @I6@ INDI",
    "1 NAME Wife Four",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1835",
    "1 DEAT",
    "2 DATE 1 JAN 1885",
    "1 FAMS @F4@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1845",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1848",
    "0 @F3@ FAM",
    "1 HUSB @I4@",
    "1 WIFE @I5@",
    "1 MARR",
    "2 DATE 1 JAN 1855",
    "0 @F4@ FAM",
    "1 HUSB @I4@",
    "1 WIFE @I6@",
    "1 MARR",
    "2 DATE 1 JAN 1858"
)

describe("parseGedcom", () => {
    it("returns one entry for a polygamous patriarch", () => {
        const result = parseGedcom(SIMPLE_POLYGAMOUS)
        expect(result).toHaveLength(1)
        expect(result[0].patriarchName).toBe("John Doe")
    })

    it("includes birth, death, and marriage facts", () => {
        const result = parseGedcom(SIMPLE_POLYGAMOUS)
        const facts = result[0].facts
        const events = facts.map(f => f.Event)
        expect(events).toContain(LifeEventEnum.Birth)
        expect(events).toContain(LifeEventEnum.Death)
        expect(events).toContain(LifeEventEnum.Marriage)
    })

    it("includes facts for both wives", () => {
        const result = parseGedcom(SIMPLE_POLYGAMOUS)
        const facts = result[0].facts
        const marriages = facts.filter(f => f.Event === LifeEventEnum.Marriage)
        const secondParties = marriages.map(f => f["Second Party"])
        expect(secondParties).toContain("Mary Smith")
        expect(secondParties).toContain("Jane Brown")
    })

    it("patriarchToFind filters to matching patriarch only", () => {
        const result = parseGedcom(DUPLICATE_NAME, "John Smith")
        // both are named John Smith — all should be returned
        expect(result).toHaveLength(2)
        for (const entry of result) {
            expect(entry.patriarchName).toBe("John Smith")
        }
    })

    it("patriarchToFind is case-insensitive", () => {
        const result = parseGedcom(SIMPLE_POLYGAMOUS, "john doe")
        expect(result).toHaveLength(1)
        expect(result[0].patriarchName).toBe("John Doe")
    })

    it("returns empty array when patriarchToFind has no match", () => {
        const result = parseGedcom(SIMPLE_POLYGAMOUS, "Nobody Here")
        expect(result).toHaveLength(0)
    })

    describe("duplicate name handling", () => {
        it("returns two separate entries for two patriarchs with the same name", () => {
            const result = parseGedcom(DUPLICATE_NAME)
            expect(result).toHaveLength(2)
            expect(result.every(r => r.patriarchName === "John Smith")).toBe(true)
        })

        it("does not share wife facts between same-named patriarchs", () => {
            const result = parseGedcom(DUPLICATE_NAME)
            const allMarriages = result.flatMap(r =>
                r.facts.filter(f => f.Event === LifeEventEnum.Marriage)
            )
            const secondParties = allMarriages.map(f => f["Second Party"])

            // Wife One and Wife Two belong to the first John Smith (@I1@)
            // Wife Three and Wife Four belong to the second John Smith (@I4@)
            // Each patriarch should only see their own wives — 2 marriages each, not 4
            expect(result[0].facts.filter(f => f.Event === LifeEventEnum.Marriage)).toHaveLength(2)
            expect(result[1].facts.filter(f => f.Event === LifeEventEnum.Marriage)).toHaveLength(2)

            // All four wives appear, but split across the two entries
            expect(secondParties).toContain("Wife One")
            expect(secondParties).toContain("Wife Two")
            expect(secondParties).toContain("Wife Three")
            expect(secondParties).toContain("Wife Four")
        })

        it("each patriarch has their own birth facts, not the other's", () => {
            const result = parseGedcom(DUPLICATE_NAME)
            for (const entry of result) {
                const births = entry.facts.filter(f => f.Event === LifeEventEnum.Birth && f.Name === "John Smith")
                // should have exactly one birth for John Smith (deduplicated)
                expect(births).toHaveLength(1)
            }
        })
    })
})