import { AXIS_COLOR } from "./colors"

export const CHART_HEIGHT = 180
export const MARGIN = { top: 24, right: 20, bottom: 44, left: 40 }

export const TICK_LABEL_PROPS = {
    fill: AXIS_COLOR,
    fontSize: 11,
    fontFamily: "monospace",
    textAnchor: "middle",
} as const

export const TICK_LABEL_PROPS_LEFT = {
    fill: AXIS_COLOR,
    fontSize: 11,
    fontFamily: "monospace",
    textAnchor: "end",
} as const

export const AGE_GAP_EDGES = [11, 14, 17, 22, 27, 32, 37, 42, 47]

export const DECADE_MIN = 1840
export const DECADE_MAX = 1920
export const DECADE_BIN_WIDTH = 10

export const SEQ_GAP_MIN = 0
export const SEQ_GAP_MAX = 32
export const SEQ_GAP_BIN_WIDTH = 2

export const CONCURRENT_AGE_MIN = 18
export const CONCURRENT_AGE_MAX = 76
