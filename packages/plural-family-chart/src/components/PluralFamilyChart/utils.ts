import { PatriarchTimeline, Timeline } from "lib/src/types"
import { patriarchColor } from "./constants"

const PADDING = 0.1
export const getMarriageDomain = (patriarch: PatriarchTimeline, timelines: Timeline[]): [Date, Date] | null => {
    const starts = patriarch.marriages.map(m => m.start?.getTime()).filter((t): t is number => t !== undefined)
    if (!starts.length) return null

    const ends = patriarch.marriages.map(m => (m.end ?? patriarch.death).getTime())

    const marriageStart = Math.min(...starts)
    const marriageEnd = Math.max(...ends)
    const span = marriageEnd - marriageStart
    const padding = span * PADDING

    const chartStart = getChartStartDate(patriarch, timelines).getTime()
    const chartEnd = getChartEndDate(patriarch, timelines).getTime()

    return [
        new Date(Math.max(marriageStart - padding, chartStart)),
        new Date(Math.min(marriageEnd + padding, chartEnd)),
    ]
}

export const getChartStartDate = (patriarch: PatriarchTimeline, timelines: Timeline[]): Date => {
    const births = [patriarch.birth, ...timelines.map(timeline => timeline.birth)].filter(
        (d): d is Date => d instanceof Date
    )
    if (!births.length) return new Date(patriarch.birth ?? Date.now())
    return new Date(Math.min(...births.map(date => date.getTime())))
}

export const getChartEndDate = (patriarch: PatriarchTimeline, timelines: Timeline[]): Date => {
    const deaths = [patriarch.death, ...timelines.map(timeline => timeline.death)].filter(
        (d): d is Date => d instanceof Date
    )
    if (!deaths.length) return new Date(Date.now())
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
            ...patriarchTimeline.marriages
                .filter(m => m.start)
                .map(marriage => ({
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
                        timeline.linkedMarriage.end?.getTime() ?? Infinity,
                        patriarchTimeline.death?.getTime() ?? Infinity,
                        timeline.death?.getTime() ?? Infinity
                    )
                ),
            },
        ],
    }))
    return [patriarchData, ...spousesData]
}
