import { describe, expect, it } from "vitest"
import { pickFillColor } from "./pickFillColor"
import { MarriageKind, patriarchColorLight, patriarchColorDark, wifeColors } from "../constants"

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

describe("pickFillColor — Patriarch", () => {
    it("colorIndex 1 has the same brightness as patriarchColorLight", () => {
        const { fill } = pickFillColor(MarriageKind.Patriarch, 1)
        expect(brightness(fill)).toBeCloseTo(brightness(patriarchColorLight), 0)
    })

    it("colorIndex 4 has the same brightness as patriarchColorDark", () => {
        const { fill } = pickFillColor(MarriageKind.Patriarch, 4)
        expect(brightness(fill)).toBeCloseTo(brightness(patriarchColorDark), 0)
    })

    it("clamps colorIndex 0 to the same brightness as colorIndex 1", () => {
        expect(brightness(pickFillColor(MarriageKind.Patriarch, 0).fill)).toBeCloseTo(
            brightness(pickFillColor(MarriageKind.Patriarch, 1).fill),
            0
        )
    })

    it("clamps colorIndex above 4 to the same brightness as colorIndex 4", () => {
        expect(brightness(pickFillColor(MarriageKind.Patriarch, 10).fill)).toBeCloseTo(
            brightness(pickFillColor(MarriageKind.Patriarch, 4).fill),
            0
        )
    })

    it("color darkens as concurrent count increases (1 → 2 → 3 → 4)", () => {
        const fills = [1, 2, 3, 4].map(i => pickFillColor(MarriageKind.Patriarch, i).fill)
        const brightnesses = fills.map(brightness)
        for (let i = 1; i < brightnesses.length; i++) {
            expect(brightnesses[i]).toBeLessThan(brightnesses[i - 1])
        }
    })

    it("always returns white text regardless of count", () => {
        for (const i of [1, 2, 3, 4]) {
            expect(pickFillColor(MarriageKind.Patriarch, i).textColor).toBe("#fff")
        }
    })
})

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