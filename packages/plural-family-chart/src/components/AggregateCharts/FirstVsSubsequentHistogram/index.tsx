import { OverlapHistogram } from "../shared/OverlapHistogram"
import { SPOUSE_TAN, WIFE_BROWN } from "../shared/colors"
import { AGE_GAP_EDGES } from "../shared/chartConstants"
import type { Bin } from "../types"

const WIFE_AGE_DOMAIN: [number, number] = [AGE_GAP_EDGES[0], AGE_GAP_EDGES[AGE_GAP_EDGES.length - 1]]

interface Props {
    firstWifeBins: Bin[]
    firstWifeCount: number
    subsequentWifeBins: Bin[]
    subsequentWifeCount: number
    maxCount: number
    width: number
    fillFirst?: string
    fillSubsequent?: string
}

export function FirstVsSubsequentHistogram({
    firstWifeBins,
    firstWifeCount,
    subsequentWifeBins,
    subsequentWifeCount,
    maxCount,
    width,
    fillFirst = WIFE_BROWN,
    fillSubsequent = SPOUSE_TAN,
}: Props) {
    return (
        <OverlapHistogram
            binsA={firstWifeBins}
            fillA={fillFirst}
            labelA="first wife"
            sampleNA={firstWifeCount}
            binsB={subsequentWifeBins}
            fillB={fillSubsequent}
            labelB="sister wife"
            sampleNB={subsequentWifeCount}
            domain={WIFE_AGE_DOMAIN}
            maxCount={maxCount}
            width={width}
            xLabel="age at marriage"
            tickValues={firstWifeBins.map(b => b.x0)}
        />
    )
}
