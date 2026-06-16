import { describe, it, expect, beforeEach } from "vitest"
import { getTimelines } from "../../main"
import { UserIntervention } from "./index"
import { FileTypes } from "../../types"

const linesToGedcom = (...lines: string[]) => ["0 HEAD", ...lines, "0 TRLR"].join("\n")

beforeEach(() => {
    UserIntervention.reset()
})

/** Patriarch with two overlapping wives but no marriage dates — forces date-related interventions */
const MISSING_MARRIAGE_DATES = linesToGedcom(
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
    // No MARR record for family 1
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@"
    // No MARR record for family 2
)

/** Two polygamous patriarchs in a single GEDCOM to test per-patriarch tagging */
const TWO_PATRIARCHS = linesToGedcom(
    // Patriarch A
    "0 @I1@ INDI",
    "1 NAME Alpha Patriarch",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1820",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Alpha Wife One",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1870",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Alpha Wife Two",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1890",
    "1 FAMS @F2@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    // Missing marriage date for family F1
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1855",
    // Patriarch B
    "0 @I4@ INDI",
    "1 NAME Beta Patriarch",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1825",
    "1 DEAT",
    "2 DATE 1 JAN 1885",
    "1 FAMS @F3@",
    "1 FAMS @F4@",
    "0 @I5@ INDI",
    "1 NAME Beta Wife One",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1828",
    "1 DEAT",
    "2 DATE 1 JAN 1875",
    "1 FAMS @F3@",
    "0 @I6@ INDI",
    "1 NAME Beta Wife Two",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1835",
    "1 DEAT",
    "2 DATE 1 JAN 1895",
    "1 FAMS @F4@",
    "0 @F3@ FAM",
    "1 HUSB @I4@",
    "1 WIFE @I5@",
    // Missing marriage date for family F3
    "0 @F4@ FAM",
    "1 HUSB @I4@",
    "1 WIFE @I6@",
    "1 MARR",
    "2 DATE 1 JAN 1860"
)

describe("UserIntervention issue collection", () => {
    it("returns an empty errors array for a clean GEDCOM with all dates present", () => {
        const CLEAN = linesToGedcom(
            "0 @I1@ INDI",
            "1 NAME Clean Patriarch",
            "1 SEX M",
            "1 BIRT",
            "2 DATE 1 JAN 1820",
            "1 DEAT",
            "2 DATE 1 JAN 1880",
            "1 FAMS @F1@",
            "1 FAMS @F2@",
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
        const { errors } = getTimelines({ fileContents: CLEAN, fileFormat: FileTypes.ged, includeMonogamous: true })
        const issuesWithReasons = errors.filter(e => !!e.reason)
        // May have minor date-format issues but no marriage-missing errors
        const missingMarriageIssues = issuesWithReasons.filter(e => e.reason?.includes("no marriage data found"))
        expect(missingMarriageIssues).toHaveLength(0)
    })

    it("records issues when marriage dates are missing", () => {
        const { errors } = getTimelines({
            fileContents: MISSING_MARRIAGE_DATES,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        expect(errors.length).toBeGreaterThan(0)
        const withReasons = errors.filter(e => !!e.reason)
        expect(withReasons.length).toBeGreaterThan(0)
    })

    it("tags issues with the patriarch name when marriage data is missing", () => {
        const { errors } = getTimelines({
            fileContents: MISSING_MARRIAGE_DATES,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        const tagged = errors.filter(e => e.patriarch !== undefined)
        expect(tagged.length).toBeGreaterThan(0)
        tagged.forEach(issue => {
            expect(issue.patriarch).toBe("Robert Missing")
        })
    })

    it("tags issues to the correct patriarch when multiple patriarchs are processed", () => {
        const { errors } = getTimelines({
            fileContents: TWO_PATRIARCHS,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        const alphaIssues = errors.filter(e => e.patriarch === "Alpha Patriarch")
        const betaIssues = errors.filter(e => e.patriarch === "Beta Patriarch")

        // Both patriarchs had a missing marriage date — both should have tagged issues
        expect(alphaIssues.length).toBeGreaterThan(0)
        expect(betaIssues.length).toBeGreaterThan(0)

        // Issues should not be cross-contaminated
        alphaIssues.forEach(i => expect(i.patriarch).toBe("Alpha Patriarch"))
        betaIssues.forEach(i => expect(i.patriarch).toBe("Beta Patriarch"))
    })

    it("resets issues between getTimelines calls", () => {
        getTimelines({
            fileContents: MISSING_MARRIAGE_DATES,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        const firstRunCount = UserIntervention.getIssues().length

        // Second call should reset — issues from first run should not accumulate
        getTimelines({
            fileContents: MISSING_MARRIAGE_DATES,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        const secondRunCount = UserIntervention.getIssues().length

        expect(secondRunCount).toBe(firstRunCount)
    })

    it("returns errors with canMakeAssumption flag when assumptions were made", () => {
        // A GEDCOM with an approximate date (only year) triggers canMakeAssumption
        const APPROX_DATE = linesToGedcom(
            "0 @I1@ INDI",
            "1 NAME Approx Patriarch",
            "1 SEX M",
            "1 BIRT",
            "2 DATE 1820", // year only — triggers assumption
            "1 DEAT",
            "2 DATE 1880",
            "1 FAMS @F1@",
            "1 FAMS @F2@",
            "0 @I2@ INDI",
            "1 NAME Wife A",
            "1 SEX F",
            "1 BIRT",
            "2 DATE 1825",
            "1 DEAT",
            "2 DATE 1870",
            "1 FAMS @F1@",
            "0 @I3@ INDI",
            "1 NAME Wife B",
            "1 SEX F",
            "1 BIRT",
            "2 DATE 1830",
            "1 DEAT",
            "2 DATE 1890",
            "1 FAMS @F2@",
            "0 @F1@ FAM",
            "1 HUSB @I1@",
            "1 WIFE @I2@",
            "1 MARR",
            "2 DATE 1845",
            "0 @F2@ FAM",
            "1 HUSB @I1@",
            "1 WIFE @I3@",
            "1 MARR",
            "2 DATE 1855"
        )
        const { errors } = getTimelines({
            fileContents: APPROX_DATE,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        const assumptions = errors.filter(e => e.canMakeAssumption === true)
        expect(assumptions.length).toBeGreaterThan(0)
        assumptions.forEach(a => expect(a.reason).toBeTruthy())
    })

    it("returns empty errors array for an empty GEDCOM without throwing", () => {
        const { errors } = getTimelines({
            fileContents: linesToGedcom(),
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        expect(errors).toEqual([])
    })

    it("MissingFact entries have the expected shape", () => {
        const { errors } = getTimelines({
            fileContents: MISSING_MARRIAGE_DATES,
            fileFormat: FileTypes.ged,
            includeMonogamous: true,
        })
        expect(errors.length).toBeGreaterThan(0)
        errors.forEach(issue => {
            expect(issue).toHaveProperty("fact")
            expect(issue).toHaveProperty("issueWith")
            // patriarch is optional but should be a string when set
            if (issue.patriarch !== undefined) {
                expect(typeof issue.patriarch).toBe("string")
            }
        })
    })
})
