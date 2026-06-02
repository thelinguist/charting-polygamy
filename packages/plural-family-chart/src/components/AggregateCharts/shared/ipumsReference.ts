/**
 * Historical spousal age gap reference data from IPUMS USA full-count census microdata.
 *
 * Source: IPUMS USA full-count samples for 1850, 1860, 1870, and 1880.
 * Spouse linking: rows are joined via the SPLOC variable, which records the PERNUM of
 * a co-residing spouse within the same household.
 *
 * Ages are ages at time of census enumeration, not ages at marriage.
 * Bins represent conditional husband age distributions given wife age.
 *
 * To regenerate: see packages/crawlers/src/ipums/processIpumsExtract.ts
 */

export interface IpumsBin {
    wifeAgeMin: number
    wifeAgeMax: number
    meanHusbandAge: number
    sdHusbandAge: number
    n: number
}

interface DecadeData {
    overallMeanGap: number
    overallSdGap: number
    n: number
    sourceUrl: string
    bins: IpumsBin[]
}

const baseUrl = "https://sda.usa.ipums.org/sdaweb/analysis/exec?formid=mnf&sdaprog=means&dataset="
const urlPostfix =
    "&sec508=false&dep=AGE&row=SEX&filters=sploc%281-99%29&weightlist=perwt&main=means&transform=none&percentileopt=none&cflevel=95&wncases=on&color=on&ch_type=bar&ch_color=yes&ch_width=600&ch_height=400&ch_orientation=vertical&ch_effects=use2D&decmeans=2&dectotals=0&decdiffs=1&decmedian=2&decse=1&decsd=1&decminmax=2&decwn=1&deczstats=2&csvformat=no&csvfilename=means.csv"

export const IPUMS_DATA: Record<number, DecadeData> = {
    1850: {
        overallMeanGap: 4.51,
        overallSdGap: 6.13,
        n: 30756,
        sourceUrl: `${baseUrl}us1850a${urlPostfix}`,
        bins: [
            { wifeAgeMin: 10, wifeAgeMax: 13, meanHusbandAge: 13, sdHusbandAge: 1, n: 2 },
            { wifeAgeMin: 13, wifeAgeMax: 15, meanHusbandAge: 18.46, sdHusbandAge: 5.08, n: 28 },
            { wifeAgeMin: 15, wifeAgeMax: 17, meanHusbandAge: 22.57, sdHusbandAge: 5.61, n: 148 },
            { wifeAgeMin: 17, wifeAgeMax: 20, meanHusbandAge: 25.05, sdHusbandAge: 4.94, n: 1076 },
            { wifeAgeMin: 20, wifeAgeMax: 25, meanHusbandAge: 27.84, sdHusbandAge: 5.3, n: 4678 },
            { wifeAgeMin: 25, wifeAgeMax: 30, meanHusbandAge: 31.64, sdHusbandAge: 5.63, n: 5541 },
            { wifeAgeMin: 30, wifeAgeMax: 35, meanHusbandAge: 36.42, sdHusbandAge: 6.41, n: 4860 },
            { wifeAgeMin: 35, wifeAgeMax: 40, meanHusbandAge: 41.12, sdHusbandAge: 6.64, n: 4001 },
            { wifeAgeMin: 40, wifeAgeMax: 45, meanHusbandAge: 45.72, sdHusbandAge: 6.6, n: 3209 },
            { wifeAgeMin: 45, wifeAgeMax: 50, meanHusbandAge: 50.33, sdHusbandAge: 6.61, n: 2503 },
            { wifeAgeMin: 50, wifeAgeMax: 55, meanHusbandAge: 55.33, sdHusbandAge: 6.78, n: 1894 },
            { wifeAgeMin: 55, wifeAgeMax: 60, meanHusbandAge: 59.99, sdHusbandAge: 6.49, n: 1147 },
        ],
    },
    1860: {
        overallMeanGap: 4.58,
        overallSdGap: 6.14,
        n: 44665,
        sourceUrl: `${baseUrl}us1860a${urlPostfix}`,
        bins: [
            { wifeAgeMin: 10, wifeAgeMax: 13, meanHusbandAge: 17.67, sdHusbandAge: 3.86, n: 3 },
            { wifeAgeMin: 13, wifeAgeMax: 15, meanHusbandAge: 19.94, sdHusbandAge: 8.59, n: 35 },
            { wifeAgeMin: 15, wifeAgeMax: 17, meanHusbandAge: 22.86, sdHusbandAge: 5.35, n: 196 },
            { wifeAgeMin: 17, wifeAgeMax: 20, meanHusbandAge: 25.29, sdHusbandAge: 5.06, n: 1488 },
            { wifeAgeMin: 20, wifeAgeMax: 25, meanHusbandAge: 28.02, sdHusbandAge: 5.47, n: 6791 },
            { wifeAgeMin: 25, wifeAgeMax: 30, meanHusbandAge: 31.81, sdHusbandAge: 5.56, n: 7986 },
            { wifeAgeMin: 30, wifeAgeMax: 35, meanHusbandAge: 36.56, sdHusbandAge: 6.43, n: 7372 },
            { wifeAgeMin: 35, wifeAgeMax: 40, meanHusbandAge: 41.11, sdHusbandAge: 6.54, n: 5845 },
            { wifeAgeMin: 40, wifeAgeMax: 45, meanHusbandAge: 45.93, sdHusbandAge: 6.69, n: 4711 },
            { wifeAgeMin: 45, wifeAgeMax: 50, meanHusbandAge: 50.37, sdHusbandAge: 6.74, n: 3488 },
            { wifeAgeMin: 50, wifeAgeMax: 55, meanHusbandAge: 55.16, sdHusbandAge: 6.48, n: 2663 },
            { wifeAgeMin: 55, wifeAgeMax: 60, meanHusbandAge: 59.55, sdHusbandAge: 6.03, n: 1650 },
        ],
    },
    1870: {
        overallMeanGap: 5.01,
        overallSdGap: 6.5,
        n: 63764,
        sourceUrl: `${baseUrl}us1870a${urlPostfix}`,
        bins: [
            { wifeAgeMin: 10, wifeAgeMax: 13, meanHusbandAge: 14, sdHusbandAge: 2.55, n: 4 },
            { wifeAgeMin: 13, wifeAgeMax: 15, meanHusbandAge: 18.27, sdHusbandAge: 5.74, n: 60 },
            { wifeAgeMin: 15, wifeAgeMax: 17, meanHusbandAge: 22.84, sdHusbandAge: 5.23, n: 250 },
            { wifeAgeMin: 17, wifeAgeMax: 20, meanHusbandAge: 24.73, sdHusbandAge: 5.29, n: 1999 },
            { wifeAgeMin: 20, wifeAgeMax: 25, meanHusbandAge: 27.92, sdHusbandAge: 5.67, n: 9270 },
            { wifeAgeMin: 25, wifeAgeMax: 30, meanHusbandAge: 32.21, sdHusbandAge: 6.18, n: 10762 },
            { wifeAgeMin: 30, wifeAgeMax: 35, meanHusbandAge: 37.32, sdHusbandAge: 6.92, n: 9520 },
            { wifeAgeMin: 35, wifeAgeMax: 40, meanHusbandAge: 41.92, sdHusbandAge: 7, n: 8750 },
            { wifeAgeMin: 40, wifeAgeMax: 45, meanHusbandAge: 46.59, sdHusbandAge: 6.92, n: 7093 },
            { wifeAgeMin: 45, wifeAgeMax: 50, meanHusbandAge: 51.01, sdHusbandAge: 6.82, n: 5497 },
            { wifeAgeMin: 50, wifeAgeMax: 55, meanHusbandAge: 55.67, sdHusbandAge: 6.79, n: 4158 },
            { wifeAgeMin: 55, wifeAgeMax: 60, meanHusbandAge: 60.09, sdHusbandAge: 6.18, n: 2556 },
        ],
    },
    1880: {
        overallMeanGap: 4.94,
        overallSdGap: 6.5,
        n: 84758,
        sourceUrl: `${baseUrl}us1880a${urlPostfix}`,
        bins: [
            { wifeAgeMin: 13, wifeAgeMax: 15, meanHusbandAge: 25.21, sdHusbandAge: 10.08, n: 24 },
            { wifeAgeMin: 15, wifeAgeMax: 17, meanHusbandAge: 24.46, sdHusbandAge: 6.63, n: 248 },
            { wifeAgeMin: 17, wifeAgeMax: 20, meanHusbandAge: 24.95, sdHusbandAge: 4.76, n: 2510 },
            { wifeAgeMin: 20, wifeAgeMax: 25, meanHusbandAge: 27.96, sdHusbandAge: 5.58, n: 11992 },
            { wifeAgeMin: 25, wifeAgeMax: 30, meanHusbandAge: 32.14, sdHusbandAge: 6.08, n: 13958 },
            { wifeAgeMin: 30, wifeAgeMax: 35, meanHusbandAge: 37.03, sdHusbandAge: 6.67, n: 12410 },
            { wifeAgeMin: 35, wifeAgeMax: 40, meanHusbandAge: 41.79, sdHusbandAge: 6.88, n: 11630 },
            { wifeAgeMin: 40, wifeAgeMax: 45, meanHusbandAge: 46.87, sdHusbandAge: 7.25, n: 9415 },
            { wifeAgeMin: 45, wifeAgeMax: 50, meanHusbandAge: 51.38, sdHusbandAge: 6.86, n: 7347 },
            { wifeAgeMin: 50, wifeAgeMax: 55, meanHusbandAge: 56.03, sdHusbandAge: 6.96, n: 5783 },
            { wifeAgeMin: 55, wifeAgeMax: 60, meanHusbandAge: 60.25, sdHusbandAge: 6.35, n: 3730 },
        ],
    },
}

/**
 * Weighted average of conditional husband age distributions across all decades,
 * grouped by wife age bin. Bins with fewer than 50 total cases are excluded
 * as statistically unreliable.
 */
export const getAveragedBins = (): IpumsBin[] => {
    const binMap = new Map<
        string,
        {
            sumMeanN: number
            sumSdN: number
            totalN: number
            wifeAgeMin: number
            wifeAgeMax: number
        }
    >()

    for (const decade of Object.values(IPUMS_DATA)) {
        for (const bin of decade.bins) {
            const key = `${bin.wifeAgeMin}-${bin.wifeAgeMax}`
            const existing = binMap.get(key)
            if (existing) {
                existing.sumMeanN += bin.meanHusbandAge * bin.n
                existing.sumSdN += bin.sdHusbandAge * bin.n
                existing.totalN += bin.n
            } else {
                binMap.set(key, {
                    sumMeanN: bin.meanHusbandAge * bin.n,
                    sumSdN: bin.sdHusbandAge * bin.n,
                    totalN: bin.n,
                    wifeAgeMin: bin.wifeAgeMin,
                    wifeAgeMax: bin.wifeAgeMax,
                })
            }
        }
    }

    return [...binMap.values()]
        .filter(v => v.totalN >= 50)
        .sort((a, b) => a.wifeAgeMin - b.wifeAgeMin)
        .map(v => ({
            wifeAgeMin: v.wifeAgeMin,
            wifeAgeMax: v.wifeAgeMax,
            meanHusbandAge: Math.round((v.sumMeanN / v.totalN) * 100) / 100,
            sdHusbandAge: Math.round((v.sumSdN / v.totalN) * 100) / 100,
            n: v.totalN,
        }))
}
