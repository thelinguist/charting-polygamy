import { PatriarchTimeline, Timeline } from "lib/src/types"

export const getConcurrentCounts = (patriarchTimeline: PatriarchTimeline, timelines: Timeline[]) =>
    patriarchTimeline.marriages.map(marriage => {
        const mStart = marriage.start?.getTime()
        if (mStart === undefined) return 0
        return timelines.filter(timeline => {
            const spouseStart = timeline.linkedMarriage.start?.getTime()
            if (spouseStart === undefined) return false
            const spouseEnd = Math.min(
                timeline.linkedMarriage.end?.getTime() ?? Infinity,
                timeline.death?.getTime() ?? Infinity,
                patriarchTimeline.death?.getTime() ?? Infinity
            )
            return spouseStart <= mStart && spouseEnd >= mStart
        }).length
    })
