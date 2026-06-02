import type { WifeTimeline } from "./patriarchTypes"

/**
 * Returns whether a wife's marriage ended while the patriarch was still alive
 * (i.e., the marriage dissolved, not ended by death).
 * A marriage end within 7 days of the wife's death is treated as death-in-marriage.
 */
export function wifeDidLeave(wife: WifeTimeline, patriarchDeath: Date | undefined): boolean {
    const linkedEnd = wife.linkedMarriage?.end
    if (!linkedEnd || !patriarchDeath) return false
    const MS_PER_DAY = 86_400_000
    const nearWifeDeath = wife.death != null && Math.abs(linkedEnd.getTime() - wife.death.getTime()) <= 7 * MS_PER_DAY
    return linkedEnd < patriarchDeath && !nearWifeDeath
}
