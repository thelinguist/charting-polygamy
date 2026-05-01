import { PatriarchTimeline } from "lib/src/types"

type PatriarchMarriage = PatriarchTimeline["marriages"][number]

export const getMarriageEnd = (marriage: PatriarchMarriage, patriarchTimeline: PatriarchTimeline) =>
    Math.min(marriage.end?.getTime() ?? Infinity, patriarchTimeline.death?.getTime() ?? Infinity)

export const getMarriageAge = (marriage: PatriarchMarriage, patriarchTimeline: PatriarchTimeline) =>
    marriage.age ||
    (marriage.start && patriarchTimeline.birth
        ? marriage.start.getFullYear() - patriarchTimeline.birth.getFullYear()
        : 0)
