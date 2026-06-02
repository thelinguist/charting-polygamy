import type { Meta, StoryObj } from "@storybook/react-vite"
import { GapBetweenMarriagesChart } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/GapBetweenMarriagesChart",
    component: GapBetweenMarriagesChart,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof GapBetweenMarriagesChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        bins: storyAggregateData.sequentialGapBins,
        sampleN: storyAggregateData.sequentialGapCount,
        width: 420,
    },
}
