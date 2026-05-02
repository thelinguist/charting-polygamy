import { scaleLinear } from "@visx/scale"
import { MarriageKind, patriarchColor, patriarchMarriedColor, wifeColors } from "../constants.ts"
import { interpolateHcl } from "@visx/vendor/d3-interpolate"

const patriarchColorScale = scaleLinear({ domain: [0, 4], range: [patriarchColor, patriarchMarriedColor] }).interpolate(
    interpolateHcl
)

export function pickFillColor(kind: MarriageKind, colorIndex: number): { fill: string; dasharray?: string; textColor: string } {
    switch (kind) {
        case MarriageKind.Patriarch:
            return {
                fill: patriarchColorScale(Math.min(colorIndex, 4)),
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
