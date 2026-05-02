import { describe, it, expect, vi, afterEach } from "vitest"
import { render, fireEvent, cleanup } from "@testing-library/react"

afterEach(cleanup)
import { ManualEntryForm } from "./ManualEntryForm"
import type { PatriarchData } from "lib"

// Helpers to fill inputs by their placeholder text
const fillByPlaceholder = (container: HTMLElement, placeholder: string, value: string) => {
    const input = container.querySelector<HTMLInputElement>(`input[placeholder="${placeholder}"]`)!
    fireEvent.change(input, { target: { value } })
}

const fillPatriarch = (container: HTMLElement, name = "John Doe", birth = "1820", death = "1890") => {
    fillByPlaceholder(container, "Full name", name)
    const numberInputs = container.querySelectorAll<HTMLInputElement>('input[type="number"]')
    fireEvent.change(numberInputs[0], { target: { value: birth } })
    fireEvent.change(numberInputs[1], { target: { value: death } })
}

// Fills name/birth/death for the Nth wife row (0-indexed)
const fillWife = (
    container: HTMLElement,
    index: number,
    { name = "Wife", birth = "1825", death = "1895", marriageStart = "", marriageEnd = "" } = {}
) => {
    const nameInputs = container.querySelectorAll<HTMLInputElement>('input[type="text"]')
    // First text input is patriarch name; wives start at index 1
    fireEvent.change(nameInputs[index + 1], { target: { value: name } })

    // Each wife row has: birth, death, marriage start, marriage end (4 number inputs per row)
    // Patriarch uses number inputs 0 and 1; wife rows start at index 2
    const numberInputs = container.querySelectorAll<HTMLInputElement>('input[type="number"]')
    const base = 2 + index * 4
    fireEvent.change(numberInputs[base], { target: { value: birth } })
    fireEvent.change(numberInputs[base + 1], { target: { value: death } })
    if (marriageStart) fireEvent.change(numberInputs[base + 2], { target: { value: marriageStart } })
    if (marriageEnd) fireEvent.change(numberInputs[base + 3], { target: { value: marriageEnd } })
}

describe("ManualEntryForm", () => {
    describe("initial render", () => {
        it("renders patriarch name, birth, and death inputs", () => {
            const { container } = render(<ManualEntryForm onChart={vi.fn()} />)
            expect(container.querySelector('input[placeholder="Full name"]')).toBeTruthy()
            const numberInputs = container.querySelectorAll('input[type="number"]')
            expect(numberInputs.length).toBeGreaterThanOrEqual(2)
        })

        it("starts with two wife rows", () => {
            const { container } = render(<ManualEntryForm onChart={vi.fn()} />)
            const nameInputs = container.querySelectorAll<HTMLInputElement>('input[type="text"]')
            // 1 patriarch + 2 wives
            expect(nameInputs).toHaveLength(3)
        })

        it("remove buttons are disabled when there are only 2 wives", () => {
            const { container } = render(<ManualEntryForm onChart={vi.fn()} />)
            const removeBtns = container.querySelectorAll<HTMLButtonElement>('button[aria-label="Remove wife"]')
            expect(removeBtns).toHaveLength(2)
            for (const btn of removeBtns) {
                expect(btn.disabled).toBe(true)
            }
        })
    })

    describe("onChart callback", () => {
        it("calls onChart(null) on mount before any input", () => {
            const onChart = vi.fn()
            render(<ManualEntryForm onChart={onChart} />)
            expect(onChart).toHaveBeenCalledWith(null)
        })

        it("calls onChart(null) when patriarch is filled but only one valid wife exists", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            // second wife row is empty → still only 1 valid wife
            expect(onChart).not.toHaveBeenCalledWith(expect.objectContaining({ "John Doe": expect.anything() }))
            const lastCall = onChart.mock.calls.at(-1)?.[0]
            expect(lastCall).toBeNull()
        })

        it("calls onChart with PatriarchData when patriarch + 2 valid wives are filled", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            const lastCall: Record<string, PatriarchData> = onChart.mock.calls.at(-1)?.[0]
            expect(lastCall).not.toBeNull()
            expect(lastCall["John Doe"]).toBeDefined()
            expect(lastCall["John Doe"].timelines).toHaveLength(2)
        })

        it("uses the patriarch name as the record key", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container, "Parley Pratt")
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            const lastCall = onChart.mock.calls.at(-1)?.[0]
            expect(lastCall["Parley Pratt"]).toBeDefined()
        })

        it("sets patriarch birth and death dates", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container, "John Doe", "1820", "1890")
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            const data: PatriarchData = onChart.mock.calls.at(-1)?.[0]["John Doe"]
            expect(data.patriarchTimeline.birth.getFullYear()).toBe(1820)
            expect(data.patriarchTimeline.death.getFullYear()).toBe(1890)
        })

        it("sets wife birth and death dates", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1835", death: "1895" })

            const data: PatriarchData = onChart.mock.calls.at(-1)?.[0]["John Doe"]
            expect(data.timelines[0].birth.getFullYear()).toBe(1825)
            expect(data.timelines[0].death.getFullYear()).toBe(1880)
            expect(data.timelines[1].birth.getFullYear()).toBe(1835)
        })

        it("includes marriage start when provided", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880", marriageStart: "1845" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            const data: PatriarchData = onChart.mock.calls.at(-1)?.[0]["John Doe"]
            expect(data.timelines[0].linkedMarriage.start?.getFullYear()).toBe(1845)
            expect(data.patriarchTimeline.marriages[0].start?.getFullYear()).toBe(1845)
        })

        it("leaves marriage start undefined when not provided", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            const data: PatriarchData = onChart.mock.calls.at(-1)?.[0]["John Doe"]
            expect(data.timelines[0].linkedMarriage.start).toBeUndefined()
        })

        it("calls onChart(null) when patriarch death is before birth", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container, "John Doe", "1890", "1820")
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            const lastCall = onChart.mock.calls.at(-1)?.[0]
            expect(lastCall).toBeNull()
        })

        it("ignores a wife row where death is before birth", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Bad Wife", birth: "1880", death: "1825" }) // invalid
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })

            // Only 1 valid wife → null
            const lastCall = onChart.mock.calls.at(-1)?.[0]
            expect(lastCall).toBeNull()
        })
    })

    describe("partial year input", () => {
        it("does not emit chart data while a year is only partially typed", () => {
            const onChart = vi.fn()
            const { container } = render(<ManualEntryForm onChart={onChart} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            // Type partial marriage end year for wife 2
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890", marriageEnd: "185" })

            // Should still produce valid data (partial year treated as undefined, not crash)
            const lastCall = onChart.mock.calls.at(-1)?.[0]
            expect(lastCall).not.toBeNull()
            const data: PatriarchData = lastCall["John Doe"]
            // marriage end should be undefined since "185" is not a valid 4-digit year
            expect(data.timelines[1].linkedMarriage.end).toBeUndefined()
        })
    })

    describe("adding and removing wives", () => {
        it("adds a wife row when '+ Add wife' is clicked", () => {
            const { container, getByText } = render(<ManualEntryForm onChart={vi.fn()} />)
            fireEvent.click(getByText("+ Add wife"))
            const nameInputs = container.querySelectorAll('input[type="text"]')
            // 1 patriarch + 3 wives
            expect(nameInputs).toHaveLength(4)
        })

        it("enables remove buttons once there are more than 2 wives", () => {
            const { container, getByText } = render(<ManualEntryForm onChart={vi.fn()} />)
            fireEvent.click(getByText("+ Add wife"))
            const removeBtns = container.querySelectorAll<HTMLButtonElement>('button[aria-label="Remove wife"]')
            for (const btn of removeBtns) {
                expect(btn.disabled).toBe(false)
            }
        })

        it("removes the correct wife row when remove is clicked", () => {
            const onChart = vi.fn()
            const { container, getByText } = render(<ManualEntryForm onChart={onChart} />)
            fireEvent.click(getByText("+ Add wife"))

            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })
            fillWife(container, 2, { name: "Wife Three", birth: "1835", death: "1895" })

            // Remove first wife
            const removeBtns = container.querySelectorAll<HTMLButtonElement>('button[aria-label="Remove wife"]')
            fireEvent.click(removeBtns[0])

            const lastCall = onChart.mock.calls.at(-1)?.[0]
            const names = lastCall["John Doe"].timelines.map((t: { name: string }) => t.name)
            expect(names).not.toContain("Wife One")
            expect(names).toContain("Wife Two")
            expect(names).toContain("Wife Three")
        })
    })

    describe("hint message", () => {
        it("shows hint when patriarch is valid but fewer than 2 valid wives exist", () => {
            const { container, getByText } = render(<ManualEntryForm onChart={vi.fn()} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            expect(getByText(/Add 1 more valid wife/)).toBeTruthy()
        })

        it("does not show hint when 2 valid wives exist", () => {
            const { queryByText, container } = render(<ManualEntryForm onChart={vi.fn()} />)
            fillPatriarch(container)
            fillWife(container, 0, { name: "Wife One", birth: "1825", death: "1880" })
            fillWife(container, 1, { name: "Wife Two", birth: "1830", death: "1890" })
            expect(queryByText(/more valid wife/)).toBeNull()
        })
    })
})
