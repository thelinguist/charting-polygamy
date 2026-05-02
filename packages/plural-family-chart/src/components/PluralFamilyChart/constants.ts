export enum MarriageKind {
    Patriarch = "patriarch",
    Spouse = "spouse",
    Other = "other",
}

export const patriarchColor = "#3b4a6b"
export const patriarchColorLight = "#6375a0" // lighter than base — 1 concurrent wife
export const patriarchColorDark = "#0d1626" // near-black navy — 4+ concurrent wives
export const strokeColor = "rgba(31,27,20,0.6)"
export const strokeWidth = 1

export const spouseColor = "#b0a794"

export const wifeColors = ["#8c5a3a", "#6b3f28", "#a37a4a", "#5d4427", "#946545", "#7a4a30"]

export const axisColor = "#5a5446"
export const tickLabelColor = "#1f1b14"

export const tickLabelProps = {
    fill: tickLabelColor,
    fontSize: 14,
    fontFamily: "sans-serif",
    textAnchor: "middle",
} as const

export const timelineAnnotationProps = {
    fontSize: 14,
    fontFamily: "sans-serif",
    textAnchor: "start",
    verticalAnchor: "middle",
    fill: "#fff",
}
export const barHeight = 50

export const labelMarginStart = 2
export const charWidthRatio = 0.5
export const labelPadding = 16
