import { AGE_GAP_HISTOGRAM_EDGES } from "../shared/chartConstants"
import { PATRIARCH_DARK, PATRIARCH_LIGHT } from "../shared/colors"
import { HistogramChart } from "../shared/HistogramChart"
import { OverlapHistogram } from "../shared/OverlapHistogram"
import type { Bin } from "../types"

const DOMAIN: [number, number] = [
    AGE_GAP_HISTOGRAM_EDGES[0],
    AGE_GAP_HISTOGRAM_EDGES[AGE_GAP_HISTOGRAM_EDGES.length - 1],
]

interface Props {
    bins: Bin[]
    maxCount: number
    sampleN: number
    width: number
    fillLight?: string
    fillDark?: string
    /** When provided, renders an overlapping series for subsequent (sister) wives. */
    subsequentBins?: Bin[]
    subsequentCount?: number
    fillSubsequent?: string
}

export function AgeGapHistogram({
    bins,
    maxCount,
    sampleN,
    width,
    fillLight = PATRIARCH_LIGHT,
    fillDark = PATRIARCH_DARK,
    subsequentBins,
    subsequentCount,
    fillSubsequent,
}: Props) {
    if (subsequentBins) {
        return (
            <OverlapHistogram
                binsA={bins}
                fillA={fillLight}
                labelA="first wife"
                sampleNA={sampleN}
                binsB={subsequentBins}
                fillB={fillSubsequent ?? fillDark}
                labelB="sister wives"
                sampleNB={subsequentCount}
                domain={DOMAIN}
                maxCount={maxCount}
                width={width}
                xLabel="years older than wife"
                tickValues={bins.map(b => b.x0)}
            />
        )
    }

    return (
        <HistogramChart
            bins={bins}
            domain={DOMAIN}
            maxCount={maxCount}
            width={width}
            getFill={(b: Bin) => (b.x0 < 0 ? fillDark : fillLight)}
            xLabel="years older than wife"
            sampleN={sampleN}
            tickValues={bins.map(b => b.x0)}
        />
    )
}
