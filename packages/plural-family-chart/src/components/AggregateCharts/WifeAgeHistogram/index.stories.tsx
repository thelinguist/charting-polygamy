import type { Meta, StoryObj } from "@storybook/react-vite"
import { WifeAgeHistogram } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/WifeAgeHistogram",
    component: WifeAgeHistogram,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof WifeAgeHistogram>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        bins: storyAggregateData.allWifeBins,
        maxCount: storyAggregateData.maxAgeCount,
        sampleN: storyAggregateData.allWifeCount,
        width: 420,
    },
}
