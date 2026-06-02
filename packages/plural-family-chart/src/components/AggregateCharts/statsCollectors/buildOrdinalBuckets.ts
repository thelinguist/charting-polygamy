import type { OrderBucket } from "../types"

export function buildOrdinalBuckets(orderAges: Map<number, number[]>): OrderBucket[] {
    const POSITION_LABELS = ["1st", "2nd", "3rd", "4th+"]
    return POSITION_LABELS.map((label, i) => {
        const ages = orderAges.get(i) ?? []
        const avg = ages.length > 0 ? ages.reduce((s, v) => s + v, 0) / ages.length : 0
        return { position: label, avgAge: avg, count: ages.length }
    }).filter(b => b.count > 0)
}
