import { scaleLinear } from "@visx/scale"
import { MarriageKind, patriarchColorLight, patriarchColorDark, wifeColors } from "../constants"
import { interpolateHcl } from "@visx/vendor/d3-interpolate"

// 1 concurrent wife → light, 4+ concurrent → very dark
const patriarchColorScale = scaleLinear({
    domain: [1, 4],
    range: [patriarchColorLight, patriarchColorDark],
}).interpolate(interpolateHcl)

export function pickFillColor(kind: MarriageKind, colorIndex: number): { fill: string; dasharray?: string; textColor: string } {
    switch (kind) {
        case MarriageKind.Patriarch:
            return {
                fill: patriarchColorScale(Math.min(Math.max(colorIndex, 1), 4)),
                textColor: "#fff",
            }
        case MarriageKind.Spouse:
            return {
                fill: wifeColors[colorIndex % wifeColors.length],
                textColor: "#fff",
            }
        case MarriageKind.Other:
            return {
                fill: "url(#other-marriage-hatch)",
                dasharray: "4,3",
                textColor: "#1f1b14",
            }
    }
}
