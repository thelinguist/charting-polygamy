import type { Meta, StoryObj } from "@storybook/react-vite"
import { WifeAgeByOrderChart } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/WifeAgeByOrderChart",
    component: WifeAgeByOrderChart,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof WifeAgeByOrderChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        avgAgeByOrder: storyAggregateData.avgAgeByOrder,
        width: 420,
    },
}
