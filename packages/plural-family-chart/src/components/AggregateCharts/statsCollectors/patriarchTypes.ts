import type { PatriarchData } from "lib"

export type WifeTimeline = PatriarchData["timelines"][number]
export type PatriarchMarriage = PatriarchData["patriarchTimeline"]["marriages"][number]
