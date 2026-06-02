import type { Meta, StoryObj } from "@storybook/react-vite"
import { FirstVsSubsequentHistogram } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/FirstVsSubsequentHistogram",
    component: FirstVsSubsequentHistogram,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof FirstVsSubsequentHistogram>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        firstWifeBins: storyAggregateData.firstWifeBins,
        firstWifeCount: storyAggregateData.firstWifeCount,
        subsequentWifeBins: storyAggregateData.subsequentWifeBins,
        subsequentWifeCount: storyAggregateData.subsequentWifeCount,
        maxCount: storyAggregateData.maxAgeCount,
        width: 420,
    },
}
