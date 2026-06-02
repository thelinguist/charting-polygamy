import type { PatriarchData } from "lib"
import {
    AGE_GAP_EDGES,
    DECADE_BIN_WIDTH,
    DECADE_MAX,
    DECADE_MIN,
    SEQ_GAP_BIN_WIDTH,
    SEQ_GAP_MAX,
    SEQ_GAP_MIN,
} from "../shared/chartConstants"
import type { AggregateData, BinWidthOptions } from "../types"
import type { ScatterPoint } from "../types"
import { createBins, createCustomBins } from "../../../utils/math"
import { collectWifeDemographics } from "./collectWifeDemographics"
import { collectScatterPoint } from "./collectScatterPoint"
import { wifeDidLeave } from "./wifeDidLeave"
import { collectSequentialGaps } from "./collectSequentialGaps"
import { collectConcurrentWives } from "./collectConcurrentWives"
import { buildOrdinalBuckets } from "./buildOrdinalBuckets"
import { buildConcurrentPoints } from "./buildConcurrentPoints"

export function computeAggregateData(
    chartData: Record<string, PatriarchData>,
    monogamousData?: Record<string, PatriarchData>,
    binWidths: BinWidthOptions = {}
): AggregateData {
    const { decadeBinWidth = DECADE_BIN_WIDTH, seqGapBinWidth = SEQ_GAP_BIN_WIDTH } = binWidths

    const allWifeAges: number[] = []
    const firstAges: number[] = []
    const subsequentAges: number[] = []
    const ageGaps: number[] = []
    const orderAges = new Map<number, number[]>()
    const marriageYears: number[] = []
    const sequentialGapYears: number[] = []
    const familySizes: number[] = []
    const concurrentByAge = new Map<number, number[]>()
    const scatterPoints: ScatterPoint[] = []
    let stayedCount = 0
    let leftCount = 0

    for (const data of Object.values(chartData)) {
        const { patriarchTimeline, timelines } = data
        const { marriages, birth, death } = patriarchTimeline

        if (timelines.length > 0) familySizes.push(timelines.length)

        timelines.forEach((wife, i) => {
            const pMarriage = marriages[i]
            collectWifeDemographics(
                wife,
                i,
                pMarriage,
                allWifeAges,
                firstAges,
                subsequentAges,
                orderAges,
                ageGaps,
                marriageYears
            )
            collectScatterPoint(wife, pMarriage, patriarchTimeline.name, scatterPoints)
            if (wifeDidLeave(wife, death)) leftCount++
            else stayedCount++
        })

        collectSequentialGaps(marriages, sequentialGapYears)

        if (birth && death) {
            collectConcurrentWives(birth, death, marriages, concurrentByAge)
        }
    }

    // Monogamous data: include in family-size distribution only
    if (monogamousData) {
        for (const monoData of Object.values(monogamousData)) {
            if (monoData.timelines.length > 0) familySizes.push(monoData.timelines.length)
        }
    }

    const allWifeBins = createCustomBins(allWifeAges, AGE_GAP_EDGES)
    const firstWifeBins = createCustomBins(firstAges, AGE_GAP_EDGES)
    const subsequentWifeBins = createCustomBins(subsequentAges, AGE_GAP_EDGES)
    const ageGapBins = createCustomBins(ageGaps, AGE_GAP_EDGES)
    const decadeBins = createBins(marriageYears, DECADE_MIN, DECADE_MAX, decadeBinWidth)
    const sequentialGapBins = createBins(sequentialGapYears, SEQ_GAP_MIN, SEQ_GAP_MAX, seqGapBinWidth)
    const maxFamilySize = familySizes.length > 0 ? Math.max(...familySizes) : 8
    const familySizeBins = createBins(familySizes, 2, maxFamilySize + 1, 1)

    const maxAgeCount = Math.max(
        ...allWifeBins.map(b => b.count),
        ...firstWifeBins.map(b => b.count),
        ...subsequentWifeBins.map(b => b.count),
        1
    )
    const maxGapCount = Math.max(...ageGapBins.map(b => b.count), 1)

    return {
        allWifeBins,
        allWifeCount: allWifeAges.length,
        firstWifeBins,
        firstWifeCount: firstAges.length,
        subsequentWifeBins,
        subsequentWifeCount: subsequentAges.length,
        ageGapBins,
        ageGapCount: ageGaps.length,
        avgAgeByOrder: buildOrdinalBuckets(orderAges),
        decadeBins,
        decadeCount: marriageYears.length,
        sequentialGapBins,
        sequentialGapCount: sequentialGapYears.length,
        familySizeBins,
        familySizeCount: familySizes.length,
        maxFamilySize,
        concurrentWivesByAge: buildConcurrentPoints(concurrentByAge),
        scatterPoints,
        marriageOutcomes: { stayed: stayedCount, left: leftCount },
        maxAgeCount,
        maxGapCount,
    }
}
