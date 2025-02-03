import { PatriarchTimeline, Timeline } from "lib/src/types"

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
