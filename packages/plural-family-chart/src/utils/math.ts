import { Bin } from "../components/AggregateCharts/types"

/**
 * group numerical data into bins
 * @param data
 * @param min
 * @param max
 * @param width
 */
export const createBins = (data: number[], min: number, max: number, width: number): Bin[] => {
    const bins: Bin[] = []
    for (let x0 = min; x0 < max; x0 += width) {
        const x1 = x0 + width
        bins.push({ x0, x1, count: data.filter(v => v >= x0 && v < x1).length })
    }
    return bins
}

/**
 * group numerical data into uneven bins
 * @param data
 * @param edges the starting boundaries of a bin
 */
export const createCustomBins = (data: number[], edges: number[]): Bin[] => {
    const bins: Bin[] = []
    for (let i = 0; i < edges.length - 1; i++) {
        const x0 = edges[i]
        const x1 = edges[i + 1]
        bins.push({ x0, x1, count: data.filter(v => v >= x0 && v < x1).length })
    }
    return bins
}
