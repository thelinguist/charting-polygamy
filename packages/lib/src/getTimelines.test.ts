import { describe, it, expect } from "vitest"
import { getTimelines } from "./main"
import { FileTypes } from "./types"

// Minimal GEDCOM helper — joins lines with \n and wraps in HEAD/TRLR
const linesToGedcom = (...lines: string[]) => ["0 HEAD", ...lines, "0 TRLR"].join("\n")

// ---------------------------------------------------------------------------
// Reusable GEDCOM fragments
// ---------------------------------------------------------------------------

/** Patriarch with two wives and overlapping marriages (classic plural family) */
const POLYGAMOUS_IN_PERIOD = linesToGedcom(
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

/** Patriarch with two wives but sequential (non-overlapping) marriages */
const SEQUENTIAL_MARRIAGES = linesToGedcom(
    "0 @I1@ INDI",
    "1 NAME James Wilson",
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
    "2 DATE 1 JAN 1822",
    "1 DEAT",
    // Wife One dies in 1853, well before the second marriage starts
    "2 DATE 1 JAN 1853",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Wife Two",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1835",
    "1 DEAT",
    "2 DATE 1 JAN 1890",
    "1 FAMS @F2@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1842",
    // First wife also divorced/ended by death — no explicit divorce, death date used
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    // Second marriage starts 5 years after wife one's death
    "2 DATE 1 JAN 1858"
)

/** Patriarch who lived entirely before the 1833 polygamy period */
const PRE_PERIOD_PATRIARCH = linesToGedcom(
    "0 @I1@ INDI",
    "1 NAME Thomas Early",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1760",
    "1 DEAT",
    // Died in 1825, eight years before polygamy was introduced
    "2 DATE 1 JAN 1825",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Wife A",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1762",
    "1 DEAT",
    "2 DATE 1 JAN 1820",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Wife B",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1765",
    "1 DEAT",
    "2 DATE 1 JAN 1830",
    "1 FAMS @F2@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1780",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1790"
)

/** Patriarch born after the latest eligible birth year (1872) */
const POST_PERIOD_PATRIARCH = linesToGedcom(
    "0 @I1@ INDI",
    "1 NAME Henry Modern",
    "1 SEX M",
    "1 BIRT",
    // Born in 1880 — too late to have been 18 during the polygamy window
    "2 DATE 1 JAN 1880",
    "1 DEAT",
    "2 DATE 1 JAN 1950",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Wife C",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1882",
    "1 DEAT",
    "2 DATE 1 JAN 1940",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Wife D",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1885",
    "1 DEAT",
    "2 DATE 1 JAN 1945",
    "1 FAMS @F2@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1905",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@",
    "1 MARR",
    "2 DATE 1 JAN 1910"
)

/** Patriarch with two wives but no marriage dates on either family record */
const MISSING_MARRIAGE_DATES = linesToGedcom(
    "0 @I1@ INDI",
    "1 NAME Samuel Unknown",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1830",
    "1 DEAT",
    "2 DATE 1 JAN 1880",
    "1 FAMS @F1@",
    "1 FAMS @F2@",
    "0 @I2@ INDI",
    "1 NAME Wife E",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1832",
    "1 DEAT",
    "2 DATE 1 JAN 1870",
    "1 FAMS @F1@",
    "0 @I3@ INDI",
    "1 NAME Wife F",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1835",
    "1 DEAT",
    "2 DATE 1 JAN 1875",
    "1 FAMS @F2@",
    // FAM records have no MARR DATE — overlap cannot be determined
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "0 @F2@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I3@"
)

/** Patriarch with a single wife — not captured by multi-partner scan */
const SINGLE_WIFE = linesToGedcom(
    "0 @I1@ INDI",
    "1 NAME Robert Mono",
    "1 SEX M",
    "1 BIRT",
    "2 DATE 1 JAN 1840",
    "1 DEAT",
    "2 DATE 1 JAN 1900",
    "1 FAMS @F1@",
    "0 @I2@ INDI",
    "1 NAME Only Wife",
    "1 SEX F",
    "1 BIRT",
    "2 DATE 1 JAN 1843",
    "1 DEAT",
    "2 DATE 1 JAN 1905",
    "1 FAMS @F1@",
    "0 @F1@ FAM",
    "1 HUSB @I1@",
    "1 WIFE @I2@",
    "1 MARR",
    "2 DATE 1 JAN 1862"
)

/** Empty GEDCOM — no individuals or families */
const EMPTY = linesToGedcom()

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("getTimelines — GEDCOM variation handling", () => {
    describe("tree with no plural families", () => {
        it("returns empty chartData when the patriarch has only one wife", () => {
            // Single-wife patriarchs are not flagged as multi-partner, so getFacts returns []
            const { chartData, monogamousData } = getTimelines({
                fileContents: SINGLE_WIFE,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(Object.keys(chartData)).toHaveLength(0)
            expect(Object.keys(monogamousData)).toHaveLength(0)
        })

        it("returns empty chartData and monogamousData for sequential (non-overlapping) marriages", () => {
            const { chartData, monogamousData } = getTimelines({
                fileContents: SEQUENTIAL_MARRIAGES,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(Object.keys(chartData)).toHaveLength(0)
            // Non-overlapping two-wife patriarch should appear in monogamousData
            expect(Object.keys(monogamousData)).toHaveLength(1)
            expect(monogamousData["James Wilson"]).toBeDefined()
        })

        it("returns empty chartData when marriage dates are missing and overlap cannot be determined", () => {
            const { chartData } = getTimelines({
                fileContents: MISSING_MARRIAGE_DATES,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(Object.keys(chartData)).toHaveLength(0)
        })
    })

    describe("tree with families outside the polygamy time period", () => {
        it("includes a pre-1833 patriarch with concurrent wives in chartData as an illegal marriage", () => {
            // He lived and died before the LDS polygamy period, but concurrent marriages
            // are still detected and shown — flagged as illegally married rather than eligible.
            const { chartData } = getTimelines({
                fileContents: PRE_PERIOD_PATRIARCH,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(chartData["Thomas Early"]).toBeDefined()
        })

        it("includes a post-1872-birth patriarch with concurrent wives in chartData as an illegal marriage", () => {
            // Born after the latest eligible birth year — marriages are still detected,
            // but the patriarch is not counted as eligible.
            const { chartData } = getTimelines({
                fileContents: POST_PERIOD_PATRIARCH,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(chartData["Henry Modern"]).toBeDefined()
        })
    })

    describe("empty or minimal trees", () => {
        it("handles an empty GEDCOM without throwing", () => {
            expect(() =>
                getTimelines({
                    fileContents: EMPTY,
                    fileFormat: FileTypes.ged,
                    includeMonogamous: true,
                })
            ).not.toThrow()
        })

        it("returns empty results for an empty GEDCOM", () => {
            const { chartData, monogamousData, skippedFamilies } = getTimelines({
                fileContents: EMPTY,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(Object.keys(chartData)).toHaveLength(0)
            expect(Object.keys(monogamousData)).toHaveLength(0)
            expect(skippedFamilies).toHaveLength(0)
        })
    })

    describe("skippedFamilies output", () => {
        it("returns empty skippedFamilies when all families parse successfully", () => {
            const { skippedFamilies } = getTimelines({
                fileContents: POLYGAMOUS_IN_PERIOD,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(skippedFamilies).toHaveLength(0)
        })

        it("skippedFamilies entries have name and reason fields", () => {
            // Even in the success path, verify the shape of the returned array
            const { skippedFamilies } = getTimelines({
                fileContents: POLYGAMOUS_IN_PERIOD,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            // If any were skipped, each entry must have name and reason
            for (const entry of skippedFamilies) {
                expect(typeof entry.name).toBe("string")
                expect(typeof entry.reason).toBe("string")
            }
        })
    })

    describe("correctly identifies a valid plural family", () => {
        it("detects concurrent marriages within the polygamy period", () => {
            const { chartData } = getTimelines({
                fileContents: POLYGAMOUS_IN_PERIOD,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(chartData["John Doe"]).toBeDefined()
            expect(chartData["John Doe"].timelines).toHaveLength(2)
        })

        it("marks the patriarch as eligible", () => {
            const { stats } = getTimelines({
                fileContents: POLYGAMOUS_IN_PERIOD,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            expect(stats.eligiblePatriarchs).toBeGreaterThan(0)
        })
    })

    describe("boundary: marriage start equals previous marriage end", () => {
        // A second marriage beginning on the exact day a first marriage ends should NOT
        // be treated as concurrent — the two marriages are sequential with no gap.
        it("does not count a marriage starting the same day the previous one ends as an overlap", () => {
            const boundary = linesToGedcom(
                "0 @I1@ INDI",
                "1 NAME Boundary Man",
                "1 SEX M",
                "1 BIRT",
                "2 DATE 1 JAN 1825",
                "1 DEAT",
                "2 DATE 1 JAN 1885",
                "1 FAMS @F1@",
                "1 FAMS @F2@",
                "0 @I2@ INDI",
                "1 NAME First Wife",
                "1 SEX F",
                "1 BIRT",
                "2 DATE 1 JAN 1826",
                "1 DEAT",
                "2 DATE 1 JAN 1860",
                "1 FAMS @F1@",
                "0 @I3@ INDI",
                "1 NAME Second Wife",
                "1 SEX F",
                "1 BIRT",
                "2 DATE 1 JAN 1835",
                "1 DEAT",
                "2 DATE 1 JAN 1880",
                "1 FAMS @F2@",
                "0 @F1@ FAM",
                "1 HUSB @I1@",
                "1 WIFE @I2@",
                "1 MARR",
                "2 DATE 1 JAN 1848",
                // First wife dies 1860 — marriage ends at that date
                "0 @F2@ FAM",
                "1 HUSB @I1@",
                "1 WIFE @I3@",
                "1 MARR",
                // Second marriage begins exactly on the day first wife died
                "2 DATE 1 JAN 1860"
            )
            const { chartData, monogamousData } = getTimelines({
                fileContents: boundary,
                fileFormat: FileTypes.ged,
                includeMonogamous: true,
            })
            // Should be sequential, not polygamous
            expect(Object.keys(chartData)).toHaveLength(0)
            expect(monogamousData["Boundary Man"]).toBeDefined()
        })
    })
})
