import type { Meta, StoryObj } from "@storybook/react-vite"
import { AgeGapHistogram } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/AgeGapHistogram",
    component: AgeGapHistogram,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof AgeGapHistogram>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        bins: storyAggregateData.ageGapBins,
        maxCount: storyAggregateData.maxGapCount,
        sampleN: storyAggregateData.ageGapCount,
        width: 420,
    },
}
