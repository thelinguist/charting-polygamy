import { PatriarchTimeline, Timeline } from "lib/src/types"

export const getConcurrentCounts = (patriarchTimeline: PatriarchTimeline, timelines: Timeline[]) =>
    patriarchTimeline.marriages.map(marriage => {
        const mStart = marriage.start!.getTime()
        return timelines.filter(timeline => {
            const spouseStart = timeline.linkedMarriage.start.getTime()
            const spouseEnd = Math.min(
                timeline.linkedMarriage.end?.getTime() ?? Infinity,
                timeline.death.getTime(),
                patriarchTimeline.death.getTime()
            )
            return spouseStart <= mStart && spouseEnd >= mStart
        }).length
    })
