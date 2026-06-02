import type { Meta, StoryObj } from "@storybook/react-vite"
import { FamilySizeChart } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/FamilySizeChart",
    component: FamilySizeChart,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof FamilySizeChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        bins: storyAggregateData.familySizeBins,
        maxFamilySize: storyAggregateData.maxFamilySize,
        sampleN: storyAggregateData.familySizeCount,
        width: 420,
    },
}
