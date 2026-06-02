import type { Meta, StoryObj } from "@storybook/react-vite"
import { MarriageOutcomesPie } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/MarriageOutcomesPie",
    component: MarriageOutcomesPie,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof MarriageOutcomesPie>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        marriageOutcomes: storyAggregateData.marriageOutcomes,
        width: 400,
    },
}
