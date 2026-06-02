import type { Meta, StoryObj } from "@storybook/react-vite"
import { ConcurrentWivesChart } from "."
import { storyAggregateData } from "../shared/storyData"

const meta = {
    title: "AggregateCharts/ConcurrentWivesChart",
    component: ConcurrentWivesChart,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        width: { control: { type: "range", min: 200, max: 800, step: 20 } },
    },
} satisfies Meta<typeof ConcurrentWivesChart>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        points: storyAggregateData.concurrentWivesByAge,
        width: 420,
    },
}
