export interface OrderBucket {
    position: string
    avgAge: number
    count: number
}

export interface ConcurrentPoint {
    age: number
    avgConcurrent: number
}

export interface ScatterPoint {
    patriarchAge: number
    wifeAge: number
    previouslyMarried: boolean
    wifeName: string
    patriarchName: string
}

export interface MarriageOutcomes {
    stayed: number
    left: number
}

export interface Bin {
    x0: number
    x1: number
    count: number
}

export interface BinWidthOptions {
    ageBinWidth?: number
    gapBinWidth?: number
    decadeBinWidth?: number
    seqGapBinWidth?: number
}

export interface AggregateData {
    // Chart 1: all wife ages
    allWifeBins: Bin[]
    allWifeCount: number
    // Chart 2: first vs subsequent
    firstWifeBins: Bin[]
    firstWifeCount: number
    subsequentWifeBins: Bin[]
    subsequentWifeCount: number
    // Chart 3: age gap at marriage (patriarch age - wife age)
    ageGapBins: Bin[]
    ageGapCount: number
    // Chart 4: average wife age by ordinal position
    avgAgeByOrder: OrderBucket[]
    // Chart 5: marriages by decade
    decadeBins: Bin[]
    decadeCount: number
    // Chart 6: years between sequential marriages
    sequentialGapBins: Bin[]
    sequentialGapCount: number
    // Chart 7: family size (wife count per patriarch)
    familySizeBins: Bin[]
    familySizeCount: number
    maxFamilySize: number
    // Chart 8: concurrent wives by patriarch age
    concurrentWivesByAge: ConcurrentPoint[]
    // Scatter: patriarch age vs wife age, colored by prior-marriage status
    scatterPoints: ScatterPoint[]
    // Pie: wives who stayed in the marriage vs. those who left
    marriageOutcomes: MarriageOutcomes
    // Shared max counts (for consistent y-axis across related charts)
    maxAgeCount: number // max of allWife, firstWife, subsequent bins
    maxGapCount: number // max of ageGap bins
}
