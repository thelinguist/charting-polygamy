import { useMemo } from "react"
import type { PatriarchData } from "lib"
import type { AggregateData, BinWidthOptions } from "./types"
import { computeAggregateData } from "./statsCollectors/computeAggregateData"

export type { AggregateData, BinWidthOptions }
export { computeAggregateData }

export function useAggregateData(
    chartData: Record<string, PatriarchData>,
    monogamousData?: Record<string, PatriarchData>,
    binWidths?: BinWidthOptions
): AggregateData {
    return useMemo(
        () => computeAggregateData(chartData, monogamousData, binWidths),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            chartData,
            monogamousData,
            binWidths?.ageBinWidth,
            binWidths?.gapBinWidth,
            binWidths?.decadeBinWidth,
            binWidths?.seqGapBinWidth,
        ]
    )
}
