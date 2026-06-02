import { HistogramChart } from "../shared/HistogramChart"
import { WIFE_BROWN } from "../shared/colors"
import { AGE_GAP_EDGES } from "../shared/chartConstants"
import type { Bin } from "../types"

const WIFE_AGE_DOMAIN: [number, number] = [AGE_GAP_EDGES[0], AGE_GAP_EDGES[AGE_GAP_EDGES.length - 1]]

interface Props {
    bins: Bin[]
    maxCount: number
    sampleN: number
    width: number
    fill?: string
}

export function WifeAgeHistogram({ bins, maxCount, sampleN, width, fill = WIFE_BROWN }: Props) {
    return (
        <HistogramChart
            bins={bins}
            domain={WIFE_AGE_DOMAIN}
            maxCount={maxCount}
            width={width}
            fill={fill}
            xLabel="age at marriage"
            sampleN={sampleN}
            tickValues={bins.map(b => b.x0)}
        />
    )
}
