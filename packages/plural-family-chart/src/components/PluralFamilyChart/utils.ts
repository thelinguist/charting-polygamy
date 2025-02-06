import { PatriarchTimeline, Timeline } from "lib/src/types"
import { patriarchColor } from "./constants.ts"

export const getChartStartDate = (patriarch: PatriarchTimeline, timelines: Timeline[]): Date => {
    const births = [patriarch.birth, ...timelines.map(timeline => timeline.birth)]

    return new Date(Math.min(...births.map(date => date.getTime())))
}

export const getChartEndDate = (patriarch: PatriarchTimeline, timelines: Timeline[]): Date => {
    const deaths = [patriarch.death, ...timelines.map(timeline => timeline.death)]

    return new Date(Math.max(...deaths.map(date => date.getTime())))
}

export const checkPersonDetails = (patriarch: PatriarchTimeline): string | undefined => {
    if (!patriarch?.birth) {
        return "Patriarch is missing birth date"
    }
    if (!patriarch?.death) {
        return "Patriarch is missing death date"
    }
}

interface TimelineData {
    name: string
    values: {
        start?: Date
        end?: Date
        color?: string
    }[]
}

export const convertTimelinesToData = (patriarchTimeline: PatriarchTimeline, timelines: Timeline[]): TimelineData[] => {
    const patriarchData = {
        name: patriarchTimeline.name,
        values: [
            {
                start: patriarchTimeline.birth,
                end: patriarchTimeline.death,
                color: patriarchColor,
            },
            ...patriarchTimeline.marriages.map(marriage => ({
                start: marriage.start,
                end: marriage.end || patriarchTimeline.death,
                color: "purple",
            })),
        ],
    }
    const spousesData = timelines.map(timeline => ({
        name: timeline.name,
        values: [
            {
                start: timeline.birth,
                end: timeline.death,
                color: "grey",
            },
            {
                start: timeline.linkedMarriage.start,
                end: new Date(
                    Math.min(
                        timeline.linkedMarriage.end?.getTime() || Infinity,
                        patriarchTimeline.death.getTime(),
                        timeline.death.getTime()
                    )
                ),
            },
        ],
    }))
    return [patriarchData, ...spousesData]
}
