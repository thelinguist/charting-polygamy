# `crawlers`

Tools for fetching and processing external data sources used by the charting-polygamy project.

---

## IPUMS Spousal Age Gap Processor

**Script:** `src/ipums/processIpumsExtract.ts`
**Run:** `pnpm ipums`

Processes a downloaded IPUMS USA full-count census extract to compute conditional spousal age gap statistics — specifically, the mean and standard deviation of husband age given wife age bin. This data drives the reference band on the Patriarch vs. Wife Age scatter plot.

### Why this data matters

The scatter plot compares LDS plural marriages against the U.S. national norm. To draw a meaningful reference band, we need to know: _given a wife of age X, what was the typical husband age in 1800s America?_ This requires linking husband and wife rows within each household — something that can't be done with the IPUMS SDA web tool alone. It requires a raw microdata extract.

### How to get the extract

1. Create a free account at [usa.ipums.org](https://usa.ipums.org)
2. Click **Get Data → Select Samples**
3. Check the following full-count (100%) samples:
    - 1850 100%
    - 1860 100%
    - 1870 100%
    - 1880 100%
4. Click **Select Harmonized Variables** and add:

    | Variable | Group                              | Description                                                                         |
    | -------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
    | `SERIAL` | Household                          | Household serial number — uniquely identifies a household within a sample year      |
    | `PERNUM` | Person                             | Person number within the household — used with SERIAL to uniquely identify a person |
    | `PERWT`  | Person                             | Person weight — not currently used but useful for future weighted analysis          |
    | `SEX`    | Person → Demographic               | Sex (1 = male, 2 = female)                                                          |
    | `AGE`    | Person → Demographic               | Age at time of census                                                               |
    | `SPLOC`  | Person → Family Interrelationships | Spouse's `PERNUM` within the same household (0 = no spouse present)                 |
    | `YEAR`   | Technical                          | Census year — allows splitting output by decade                                     |

5. Submit the extract and select **CSV** format (gzipped is fine)
6. After downloading, unzip: `gunzip your-file.csv.gz`
7. Place the CSV at `packages/crawlers/src/ipums/extract.csv`

### Running the script

```sh
pnpm ipums
```

The script will:

- Parse all rows (expect several million — takes 1–2 minutes)
- Group persons by census year
- For each year, link wife rows to husband rows via `SPLOC`
- Bin wives by age using edges: `[10, 13, 15, 17, 20, 25, 30, 35, 40, 45, 50]`
- Compute mean and SD of husband age per wife age bin
- Print a summary table to stdout
- Write full results to `src/ipums/output.json`

### After running

Copy the output into:

```
packages/plural-family-chart/src/components/AggregateCharts/shared/ipumsReference.ts
```

This file is imported by the scatter plot to render the static reference band.

### Notes

- Ages in the census are ages _at time of enumeration_, not ages at marriage. The gap distribution is therefore slightly wider than a true "age at marriage" dataset would show.
- `SPLOC` only links co-residing spouses. Separated couples will not appear. This slightly biases the sample toward stable marriages.
- The 1860–1880 full-count samples are large (30–50M rows). The extract may be several GB uncompressed. The script streams via papaparse and should handle it without issues.
