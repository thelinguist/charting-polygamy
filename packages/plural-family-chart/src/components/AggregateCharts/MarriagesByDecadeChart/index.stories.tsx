import type { Meta, StoryObj } from "@storybook/react-vite"
import { MarriagesByDecadeChart } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/MarriagesByDecadeChart",
    component: MarriagesByDecadeChart,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof MarriagesByDecadeChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        bins: storyAggregateData.decadeBins,
        sampleN: storyAggregateData.decadeCount,
        width: 420,
    },
}
