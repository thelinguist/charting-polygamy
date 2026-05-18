import { describe, expect, it } from "vitest"
import { pickFillColor } from "./pickFillColor"
import { MarriageKind, wifeColors } from "../constants"

// Perceptual brightness (ITU-R 601). Handles both "#rrggbb" and "rgb(r, g, b)" —
// HCL interpolation returns rgb() strings for intermediate values.
function brightness(color: string): number {
    let r: number, g: number, b: number
    if (color.startsWith("#")) {
        const n = parseInt(color.slice(1), 16)
        r = (n >> 16) & 0xff
        g = (n >> 8) & 0xff
        b = n & 0xff
    } else {
        const [rr, gg, bb] = (color.match(/\d+/g) ?? []).map(Number)
        ;[r, g, b] = [rr, gg, bb]
    }
    return 0.299 * r + 0.587 * g + 0.114 * b
}

describe("pickFillColor — Spouse", () => {
    it("returns wifeColors[0] for colorIndex 0", () => {
        expect(pickFillColor(MarriageKind.Spouse, 0).fill).toBe(wifeColors[0])
    })

    it("wraps colorIndex by the wifeColors array length", () => {
        const len = wifeColors.length
        expect(pickFillColor(MarriageKind.Spouse, len).fill).toBe(wifeColors[0])
        expect(pickFillColor(MarriageKind.Spouse, len + 2).fill).toBe(wifeColors[2])
    })
})

describe("pickFillColor — Other", () => {
    it("uses the hatch pattern fill", () => {
        expect(pickFillColor(MarriageKind.Other, 0).fill).toBe("url(#other-marriage-hatch)")
    })

    it("uses a dashed stroke", () => {
        expect(pickFillColor(MarriageKind.Other, 0).dasharray).toBeTruthy()
    })

    it("uses dark text for legibility over the hatch", () => {
        const { textColor } = pickFillColor(MarriageKind.Other, 0)
        expect(brightness(textColor)).toBeLessThan(128)
    })
})
