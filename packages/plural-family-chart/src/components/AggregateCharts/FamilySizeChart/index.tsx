import { HistogramChart } from "../shared/HistogramChart"
import { PATRIARCH_LIGHT } from "../shared/colors"
import type { Bin } from "../types"

interface Props {
    bins: Bin[]
    maxFamilySize: number
    sampleN: number
    width: number
    fill?: string
}

export function FamilySizeChart({ bins, maxFamilySize, sampleN, width, fill = PATRIARCH_LIGHT }: Props) {
    const maxCount = Math.max(...bins.map(b => b.count), 1)
    return (
        <HistogramChart
            bins={bins}
            domain={[2, maxFamilySize + 1]}
            maxCount={maxCount}
            width={width}
            fill={fill}
            xLabel="wives per patriarch"
            sampleN={sampleN}
            tickValues={bins.map(b => b.x0)}
        />
    )
}
