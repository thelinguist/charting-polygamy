import type { ScatterPoint } from "../types"
import type { WifeTimeline, PatriarchMarriage } from "./patriarchTypes"

export function collectScatterPoint(
    wife: WifeTimeline,
    pMarriage: PatriarchMarriage | undefined,
    patriarchName: string,
    scatterPoints: ScatterPoint[]
): void {
    if (wife.age == null || pMarriage?.age == null) return
    const linkedStart = wife.linkedMarriage?.start
    const previouslyMarried = linkedStart != null && wife.otherMarriages.some(m => m.start < linkedStart)
    scatterPoints.push({
        patriarchAge: pMarriage.age,
        wifeAge: wife.age,
        previouslyMarried,
        wifeName: wife.name,
        patriarchName,
    })
}
