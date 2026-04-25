import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { ClippedText } from "./ClippedText"
import { labelMarginStart } from "./constants"

const wrap = (ui: React.ReactElement) =>
    render(<svg>{ui}</svg>)

describe("ClippedText clipRectWidth", () => {
    it("is xEnd - xStart - labelMarginStart", () => {
        const { container } = wrap(
            <ClippedText xStart={100} xEnd={300} y={50}>hello</ClippedText>
        )
        const rect = container.querySelector("clipPath rect")
        expect(Number(rect?.getAttribute("width"))).toBe(300 - 100 - labelMarginStart)
    })

    it("is 0 when xEnd leaves no room after margin", () => {
        const { container } = wrap(
            <ClippedText xStart={100} xEnd={101} y={50}>hello</ClippedText>
        )
        const rect = container.querySelector("clipPath rect")
        expect(Number(rect?.getAttribute("width"))).toBe(0)
    })

    it("is 0 when xEnd equals xStart", () => {
        const { container } = wrap(
            <ClippedText xStart={100} xEnd={100} y={50}>hello</ClippedText>
        )
        const rect = container.querySelector("clipPath rect")
        expect(Number(rect?.getAttribute("width"))).toBe(0)
    })

    it("applies clipPath to text by default", () => {
        const { container } = wrap(
            <ClippedText xStart={100} xEnd={300} y={50}>hello</ClippedText>
        )
        const text = container.querySelector("text")
        expect(text?.getAttribute("clip-path")).toBeTruthy()
    })

    it("does not apply clipPath when disableClip is true", () => {
        const { container } = wrap(
            <ClippedText xStart={100} xEnd={300} y={50} disableClip>hello</ClippedText>
        )
        const text = container.querySelector("text")
        expect(text?.getAttribute("clip-path")).toBeNull()
    })
})
