import { AGE_GAP_EDGES } from "../shared/chartConstants"
import { PATRIARCH_DARK, PATRIARCH_LIGHT } from "../shared/colors"
import { HistogramChart } from "../shared/HistogramChart"
import type { Bin } from "../types"

interface Props {
    bins: Bin[]
    maxCount: number
    sampleN: number
    width: number
    fillLight?: string
    fillDark?: string
}

export function AgeGapHistogram({
    bins,
    maxCount,
    sampleN,
    width,
    fillLight = PATRIARCH_LIGHT,
    fillDark = PATRIARCH_DARK,
}: Props) {
    return (
        <HistogramChart
            bins={bins}
            domain={[AGE_GAP_EDGES[0], AGE_GAP_EDGES[AGE_GAP_EDGES.length - 1]]}
            maxCount={maxCount}
            width={width}
            getFill={(b: Bin) => (b.x0 < 0 ? fillDark : fillLight)}
            xLabel="years older than wife"
            sampleN={sampleN}
            tickValues={bins.map(b => b.x0)}
        />
    )
}
