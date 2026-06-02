import type { Meta, StoryObj } from "@storybook/react-vite"
import { PatriarchWifeAgeScatter } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/PatriarchWifeAgeScatter",
    component: PatriarchWifeAgeScatter,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 300, max: 1000, step: 20 } },
    },
} satisfies Meta<typeof PatriarchWifeAgeScatter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        scatterPoints: storyAggregateData.scatterPoints,
        width: 700,
    },
}
