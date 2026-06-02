import { CONCURRENT_AGE_MAX, CONCURRENT_AGE_MIN } from "../shared/chartConstants"
import type { ConcurrentPoint } from "../types"

export function buildConcurrentPoints(concurrentByAge: Map<number, number[]>): ConcurrentPoint[] {
    const points: ConcurrentPoint[] = []
    for (let age = CONCURRENT_AGE_MIN; age < CONCURRENT_AGE_MAX; age++) {
        const counts = concurrentByAge.get(age)
        if (!counts || counts.length === 0) continue
        const avg = counts.reduce((s, v) => s + v, 0) / counts.length
        points.push({ age, avgConcurrent: avg })
    }
    return points
}
