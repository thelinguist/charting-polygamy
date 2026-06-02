import { SEQ_GAP_MAX, SEQ_GAP_MIN } from "../shared/chartConstants"
import { yearsBetween } from "../../../utils/dates"
import type { PatriarchMarriage } from "./patriarchTypes"

export function collectSequentialGaps(marriages: PatriarchMarriage[], sequentialGapYears: number[]): void {
    for (let i = 1; i < marriages.length; i++) {
        const prev = marriages[i - 1].start
        const curr = marriages[i].start
        if (prev && curr) {
            const gap = yearsBetween(prev, curr)
            if (gap >= SEQ_GAP_MIN && gap < SEQ_GAP_MAX) {
                sequentialGapYears.push(gap)
            }
        }
    }
}
