import { MarriageKind, patriarchColorLight, wifeColors } from "../constants"

export function pickFillColor(
    kind: MarriageKind,
    colorIndex: number
): { fill: string; dasharray?: string; textColor: string } {
    switch (kind) {
        case MarriageKind.Patriarch:
            return {
                fill: patriarchColorLight,
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
