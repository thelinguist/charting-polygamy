import { describe, it, expect, beforeEach } from "vitest"
import { parse } from "parse-gedcom"
import { getFamilies } from "./getFamilies"
import { mapDatabase } from "./database"
import { UserIntervention } from "../user-intervention"
import { GedcomTree, LifeEventEnum } from "../../types"

const gedcom = (...lines: string[]) => ["0 HEAD", ...lines, "0 TRLR"].join("\n")

const makeDatabase = (content: string) => {
    const records = parse(content) as GedcomTree
    return mapDatabase(records.children)
}

beforeEach(() => {
    UserIntervention.reset()
})

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

/** Patriarch with two wives and full marriage records */
const POLYGAMOUS = gedcom(
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

/** Patriarch with only one wife — not a multi-partner candidate */
const MONOGAMOUS = gedcom(
    "0 @I1@ INDI",
    "1 NAME Solo Patriarch",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "0 @I2@ INDI",
    "1 NAME Only Wife",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1875",
    "1 FAMS @F1@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1845"
)

/** Patriarch with a missing marriage record for one wife */
const MISSING_MARRIAGE = gedcom(
    "0 @I1@ INDI",
    "1 NAME Robert Missing",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Wife Alpha",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1870",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Wife Beta",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1890",
    "1 FAMS @F2@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    // No MARR record
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1855"
)

/** Two patriarchs with the same name, keyed by xref_id */
const DUPLICATE_NAMES = gedcom(
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

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getFamilies", () => {
    describe("output shape", () => {
        it("returns one entry per patriarch (keyed by xref_id)", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            expect(Object.keys(result)).toHaveLength(1)
        })

        it("entry has name and families fields", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            const entry = Object.values(result)[0]
            expect(entry.name).toBe("John Doe")
            expect(Array.isArray(entry.families)).toBe(true)
        })

        it("each wife produces a separate family entry", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            const entry = Object.values(result)[0]
            expect(entry.families).toHaveLength(2)
        })
    })

    describe("candidate filtering", () => {
        it("excludes patriarchs with only one wife", () => {
            const db = makeDatabase(MONOGAMOUS)
            const result = getFamilies(db)
            expect(Object.keys(result)).toHaveLength(0)
        })

        it("includes patriarchs with two or more wives", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            expect(Object.keys(result)).toHaveLength(1)
        })
    })

    describe("patriarchToFind filter", () => {
        it("returns only the matching patriarch", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db, "John Doe")
            expect(Object.keys(result)).toHaveLength(1)
            expect(Object.values(result)[0].name).toBe("John Doe")
        })

        it("is case-insensitive", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db, "john doe")
            expect(Object.keys(result)).toHaveLength(1)
        })

        it("returns empty when the name does not match", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db, "Nobody Here")
            expect(Object.keys(result)).toHaveLength(0)
        })
    })

    describe("facts content", () => {
        it("includes the patriarch's birth fact", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            const allFacts = Object.values(result)[0].families.flat()
            expect(allFacts.some(f => f.Event === LifeEventEnum.Birth && f.Name === "John Doe")).toBe(true)
        })

        it("includes the patriarch's death fact", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            const allFacts = Object.values(result)[0].families.flat()
            expect(allFacts.some(f => f.Event === LifeEventEnum.Death && f.Name === "John Doe")).toBe(true)
        })

        it("includes a marriage fact for each wife", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            const allFacts = Object.values(result)[0].families.flat()
            const marriages = allFacts.filter(f => f.Event === LifeEventEnum.Marriage)
            const spouses = marriages.map(f => f["Second Party"])
            expect(spouses).toContain("Mary Smith")
            expect(spouses).toContain("Jane Brown")
        })

        it("includes wife birth and death facts in her family entry", () => {
            const db = makeDatabase(POLYGAMOUS)
            const result = getFamilies(db)
            const allFacts = Object.values(result)[0].families.flat()
            expect(allFacts.some(f => f.Event === LifeEventEnum.Birth && f.Name === "Mary Smith")).toBe(true)
            expect(allFacts.some(f => f.Event === LifeEventEnum.Death && f.Name === "Mary Smith")).toBe(true)
        })
    })

    describe("missing marriage record", () => {
        it("still includes a marriage fact when the MARR record is absent", () => {
            const db = makeDatabase(MISSING_MARRIAGE)
            const result = getFamilies(db)
            const allFacts = Object.values(result)[0].families.flat()
            const alphaMar = allFacts.find(
                f => f.Event === LifeEventEnum.Marriage && f["Second Party"] === "Wife Alpha"
            )
            expect(alphaMar).toBeDefined()
        })

        it("records a UserIntervention issue when the marriage record is missing", () => {
            const db = makeDatabase(MISSING_MARRIAGE)
            getFamilies(db)
            const issues = UserIntervention.getIssues()
            const marriageIssue = issues.find(i => i.reason?.includes("no marriage data found"))
            expect(marriageIssue).toBeDefined()
        })

        it("tags the missing-marriage issue with the correct patriarch name", () => {
            const db = makeDatabase(MISSING_MARRIAGE)
            getFamilies(db)
            const issues = UserIntervention.getIssues()
            const marriageIssue = issues.find(i => i.reason?.includes("no marriage data found"))
            expect(marriageIssue?.patriarch).toBe("Robert Missing")
        })
    })

    describe("issue tagging", () => {
        it("tags patriarch birth/death issues with the patriarch name", () => {
            const db = makeDatabase(POLYGAMOUS)
            getFamilies(db)
            const issues = UserIntervention.getIssues()
            const patriarchIssues = issues.filter(i => i.fact.Name === "John Doe")
            patriarchIssues.forEach(i => expect(i.patriarch).toBe("John Doe"))
        })

        it("tags wife birth/death issues with the patriarch name (not the wife's name)", () => {
            const db = makeDatabase(POLYGAMOUS)
            getFamilies(db)
            const issues = UserIntervention.getIssues()
            const wifeIssues = issues.filter(i => i.fact.Name === "Mary Smith")
            wifeIssues.forEach(i => expect(i.patriarch).toBe("John Doe"))
        })
    })

    describe("duplicate patriarch names", () => {
        it("returns a separate entry for each patriarch even when names are identical", () => {
            const db = makeDatabase(DUPLICATE_NAMES)
            const result = getFamilies(db)
            expect(Object.keys(result)).toHaveLength(2)
        })

        it("each entry has its own distinct set of wives", () => {
            const db = makeDatabase(DUPLICATE_NAMES)
            const result = getFamilies(db)
            const entries = Object.values(result)

            const wivesA = entries[0].families
                .flat()
                .filter(f => f.Event === LifeEventEnum.Marriage)
                .map(f => f["Second Party"])

            const wivesB = entries[1].families
                .flat()
                .filter(f => f.Event === LifeEventEnum.Marriage)
                .map(f => f["Second Party"])

            // No overlap between the two sets
            expect(wivesA.some(w => wivesB.includes(w))).toBe(false)
        })
    })
})