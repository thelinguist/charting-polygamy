/**
 * Shared story data for AggregateCharts individual chart stories.
 * Deserializes data.json and computes AggregateData once at module load.
 */
import type { PatriarchData } from "lib"
import rawData from "../../../../.storybook/storybook-mock-data.json"
import { computeAggregateData } from "../statsCollectors/computeAggregateData"

type RawPayload = (typeof rawData)["data"][number]

function deserializePayload(data: typeof rawData): Record<string, PatriarchData> {
    return Object.fromEntries(
        data.data.map((p: RawPayload) => [
            p.n,
            {
                patriarchTimeline: {
                    name: p.pt.n,
                    birth: new Date(p.pt.b),
                    death: new Date(p.pt.d),
                    marriages: p.pt.m.map((m: { s?: string; e?: string; a?: number; g?: number }) => ({
                        ...(m.s ? { start: new Date(m.s) } : {}),
                        ...(m.e ? { end: new Date(m.e) } : {}),
                        ...(m.a !== undefined ? { age: m.a } : {}),
                        ...(m.g !== undefined ? { gap: m.g } : {}),
                    })),
                },
                timelines: p.tl.map(
                    (t: {
                        n: string
                        b: string
                        d: string
                        lm: { s?: string; e?: string }
                        om?: { s: string; e: string; sp: string }[]
                        a?: number
                        g?: number
                    }) => ({
                        name: t.n,
                        birth: new Date(t.b),
                        death: new Date(t.d),
                        linkedMarriage: {
                            ...(t.lm.s ? { start: new Date(t.lm.s) } : {}),
                            ...(t.lm.e ? { end: new Date(t.lm.e) } : {}),
                        },
                        otherMarriages: (t.om ?? []).map(o => ({
                            start: new Date(o.s),
                            end: new Date(o.e),
                            spouse: o.sp,
                        })),
                        ...(t.a !== undefined ? { age: t.a } : {}),
                        ...(t.g !== undefined ? { gap: t.g } : {}),
                    })
                ),
            },
        ])
    )
}

export const storyChartData = deserializePayload(rawData)
export const storyAggregateData = computeAggregateData(storyChartData)
