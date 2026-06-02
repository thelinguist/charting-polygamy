import { PATRIARCH_DARK } from "../shared/colors"
import { DECADE_MAX, DECADE_MIN } from "../shared/chartConstants"
import { HistogramChart } from "../shared/HistogramChart"
import type { Bin } from "../types"

const REFERENCE_LINES = [
    { x: 1847, label: "Mormon Exodus" },
    { x: 1890, label: "1890 Manifesto" },
]

const DECADE_DOMAIN: [number, number] = [DECADE_MIN, DECADE_MAX]
const TICK_VALUES = [1840, 1850, 1860, 1870, 1880, 1890, 1900, 1910, 1920]

interface Props {
    bins: Bin[]
    sampleN: number
    width: number
    fill?: string
}

export function MarriagesByDecadeChart({ bins, sampleN, width, fill = PATRIARCH_DARK }: Props) {
    const maxCount = Math.max(...bins.map(b => b.count), 1)
    return (
        <HistogramChart
            bins={bins}
            domain={DECADE_DOMAIN}
            maxCount={maxCount}
            width={width}
            fill={fill}
            xLabel="decade"
            sampleN={sampleN}
            tickValues={TICK_VALUES}
            tickFormat={v => `${v}`}
            referenceLines={REFERENCE_LINES}
        />
    )
}
