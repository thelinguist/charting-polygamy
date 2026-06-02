/**
 * IPUMS Spousal Age Gap Processor
 *
 * Reads an IPUMS USA CSV extract and computes, for each wife age bin,
 * the mean and SD of husband age — producing a conditional reference table
 * suitable for the scatter plot band in plural-family-chart.
 *
 * ## How to get the extract
 * 1. Go to https://usa.ipums.org and create a free account
 * 2. Click "Browse and Select Data Data" → "Select Samples" → check: 1850 100%, 1860 100%, 1870 100%, 1880 100%
 * 3. Click "Select Harmonized Variables" and add:
 *    - SERIAL   (household serial number)
 *    - PERNUM   (person number within household)
 *    - PERWT    (person weight)
 *    - SEX      (sex)
 *    - AGE      (age)
 *    - SPLOC    (spouse's location in household — links husband and wife rows)
 *    - YEAR     (census year)
 * 4. It's put in your "shopping cart," so check out to download (for free) as CSV (gzipped is fine — unzip first)
 * 5. Place the CSV at packages/crawlers/src/ipums/extract.csv
 * 6. Run: pnpm ts-node src/ipums/processIpumsExtract.ts
 *
 * Output is written to src/ipums/output.json and printed to stdout.
 * Copy the output into plural-family-chart/src/components/AggregateCharts/shared/ipumsReference.ts
 */

import * as fs from "fs"
import * as path from "path"
import Papa from "papaparse"

// ── Wife age bins (must match WIFE_AGE_EDGES in useAggregateData.ts) ─────────
const WIFE_AGE_EDGES = [10, 13, 15, 17, 20, 25, 30, 35, 40, 45, 50, 55, 60]

interface IpumsRow {
    YEAR: string
    SERIAL: string
    PERNUM: string
    PERWT: string
    SEX: string
    AGE: string
    SPLOC: string
}

interface PersonRecord {
    serial: string
    pernum: number
    perwt: number
    sex: number // 1 = male, 2 = female
    age: number
    sploc: number // 0 = no spouse, otherwise line number of spouse
}

interface BinResult {
    wifeAgeMin: number
    wifeAgeMax: number
    meanHusbandAge: number
    sdHusbandAge: number
    n: number
}

interface YearResult {
    year: number
    bins: BinResult[]
    overallMeanGap: number
    overallSdGap: number
    n: number
}

function findBin(age: number): [number, number] | null {
    for (let i = 0; i < WIFE_AGE_EDGES.length - 1; i++) {
        if (age >= WIFE_AGE_EDGES[i] && age < WIFE_AGE_EDGES[i + 1]) {
            return [WIFE_AGE_EDGES[i], WIFE_AGE_EDGES[i + 1]]
        }
    }
    return null
}

function mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length
}

function sd(values: number[], avg: number): number {
    const variance = values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length
    return Math.sqrt(variance)
}

function processYear(rows: PersonRecord[]): Omit<YearResult, "year"> {
    // Build a lookup: serial+pernum → record
    const lookup = new Map<string, PersonRecord>()
    for (const row of rows) {
        lookup.set(`${row.serial}-${row.pernum}`, row)
    }

    // Build coupled pairs: for each woman with a spouse, find her husband
    const gaps: number[] = []
    const binData = new Map<string, number[]>() // "min-max" → husband ages

    for (const wife of rows) {
        if (wife.sex !== 2 || wife.sploc === 0) continue
        const husband = lookup.get(`${wife.serial}-${wife.sploc}`)
        if (!husband || husband.sex !== 1) continue

        const gap = husband.age - wife.age
        gaps.push(gap)

        const bin = findBin(wife.age)
        if (!bin) continue
        const key = `${bin[0]}-${bin[1]}`
        if (!binData.has(key)) binData.set(key, [])
        binData.get(key)!.push(husband.age)
    }

    const bins: BinResult[] = []
    for (let i = 0; i < WIFE_AGE_EDGES.length - 1; i++) {
        const min = WIFE_AGE_EDGES[i]
        const max = WIFE_AGE_EDGES[i + 1]
        const husbandAges = binData.get(`${min}-${max}`) ?? []
        if (husbandAges.length === 0) continue
        const avg = mean(husbandAges)
        bins.push({
            wifeAgeMin: min,
            wifeAgeMax: max,
            meanHusbandAge: Math.round(avg * 100) / 100,
            sdHusbandAge: Math.round(sd(husbandAges, avg) * 100) / 100,
            n: husbandAges.length,
        })
    }

    const overallMeanGap = gaps.length > 0 ? Math.round(mean(gaps) * 100) / 100 : 0
    const overallSdGap = gaps.length > 0 ? Math.round(sd(gaps, mean(gaps)) * 100) / 100 : 0

    return { bins, overallMeanGap, overallSdGap, n: gaps.length }
}

async function main() {
    const csvPath = path.join(__dirname, "extract.csv")
    if (!fs.existsSync(csvPath)) {
        console.error(`\nExtract not found at: ${csvPath}`)
        console.error("Follow the instructions at the top of this file to download the extract.\n")
        process.exit(1)
    }

    console.log("Reading extract…")
    const raw = fs.readFileSync(csvPath, "utf-8")
    const { data } = Papa.parse<IpumsRow>(raw, { header: true, skipEmptyLines: true })

    console.log(`Parsed ${data.length.toLocaleString()} rows. Linking spouses…`)

    // Group by year
    const byYear = new Map<number, PersonRecord[]>()
    for (const row of data) {
        const year = parseInt(row.YEAR)
        const sploc = parseInt(row.SPLOC)
        if (!byYear.has(year)) byYear.set(year, [])
        byYear.get(year)!.push({
            serial: row.SERIAL,
            pernum: parseInt(row.PERNUM),
            perwt: parseFloat(row.PERWT),
            sex: parseInt(row.SEX),
            age: parseInt(row.AGE),
            sploc,
        })
    }

    const results: YearResult[] = []
    for (const [year, rows] of [...byYear.entries()].sort(([a], [b]) => a - b)) {
        console.log(`Processing ${year} (${rows.length.toLocaleString()} persons)…`)
        results.push({ year, ...processYear(rows) })
    }

    // Print summary
    console.log("\n── Results ─────────────────────────────────────────────\n")
    for (const r of results) {
        console.log(`${r.year}: mean gap ${r.overallMeanGap} yrs, SD ${r.overallSdGap}, n=${r.n.toLocaleString()}`)
        for (const b of r.bins) {
            console.log(
                `  wives ${b.wifeAgeMin}–${b.wifeAgeMax}: mean husband age ${b.meanHusbandAge} (SD ${b.sdHusbandAge}, n=${b.n})`
            )
        }
    }

    const outputPath = path.join(__dirname, "output.json")
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
    console.log(`\nOutput written to ${outputPath}`)
    console.log("Copy results into ipumsReference.ts\n")
}

main()
