export interface ChartStats {
    polygamistCount: number // total men with concurrent marriages
    practicingPercent?: number // polygamist LDS men / total eligible LDS men
    averageWives: number // mean wife count, to 1 decimal
    maxWives: number // highest wife count
    maxWivesName: string // patriarch who holds that record
    afterBanCount: number // married after the 1890 Manifesto
    afterBanPercent: number // as % of polygamistCount, 0–100
}
