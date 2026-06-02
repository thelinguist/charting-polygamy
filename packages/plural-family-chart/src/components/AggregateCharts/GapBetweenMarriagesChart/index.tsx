import { HistogramChart } from "../shared/HistogramChart"
import { SPOUSE_TAN } from "../shared/colors"
import { SEQ_GAP_MAX, SEQ_GAP_MIN } from "../shared/chartConstants"
import type { Bin } from "../types"

const SEQ_GAP_DOMAIN: [number, number] = [SEQ_GAP_MIN, SEQ_GAP_MAX]

interface Props {
    bins: Bin[]
    sampleN: number
    width: number
    fill?: string
}

export function GapBetweenMarriagesChart({ bins, sampleN, width, fill = SPOUSE_TAN }: Props) {
    const maxCount = Math.max(...bins.map(b => b.count), 1)
    // 2-year bins — show every other tick (multiples of 4) to avoid crowding
    const tickValues = bins.map(b => b.x0).filter(v => v % 4 === 0)
    return (
        <HistogramChart
            bins={bins}
            domain={SEQ_GAP_DOMAIN}
            maxCount={maxCount}
            width={width}
            fill={fill}
            xLabel="years between marriages"
            sampleN={sampleN}
            tickValues={tickValues}
        />
    )
}
