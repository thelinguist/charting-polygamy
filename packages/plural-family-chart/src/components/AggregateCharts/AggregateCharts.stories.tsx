import type { Meta, StoryObj } from "@storybook/react-vite"
import { AggregateCharts } from "./AggregateCharts"
import { storyChartData } from "./shared/storyData"

const meta = {
    title: "AggregateCharts/Main",
    component: AggregateCharts,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
    argTypes: {
        minDataPoints: { control: "number" },
    },
} satisfies Meta<typeof AggregateCharts>

export default meta
type Story = StoryObj<typeof meta>

export const RealFamilyTreeData: Story = {
    args: {
        chartData: storyChartData,
    },
    decorators: [
        Story => (
            <div style={{ padding: 24, background: "#f1ead8", minHeight: "100vh" }}>
                <Story />
            </div>
        ),
    ],
}

type BinWidthExplorerArgs = {
    ageBinWidth: number
    gapBinWidth: number
    decadeBinWidth: number
    seqGapBinWidth: number
}

export const BinWidthExplorer: StoryObj<BinWidthExplorerArgs> = {
    argTypes: {
        ageBinWidth: {
            control: { type: "select" },
            options: [1, 2, 3],
            description: "Wife age histogram bin width (years)",
        },
        gapBinWidth: {
            control: { type: "select" },
            options: [2, 3, 5],
            description: "Age gap histogram bin width (years)",
        },
        decadeBinWidth: {
            control: { type: "select" },
            options: [5, 10, 15],
            description: "Marriages by decade bin width (years)",
        },
        seqGapBinWidth: {
            control: { type: "select" },
            options: [1, 2, 4],
            description: "Gap between sequential marriages bin width (years)",
        },
    },
    args: {
        ageBinWidth: 3,
        gapBinWidth: 3,
        decadeBinWidth: 10,
        seqGapBinWidth: 2,
    },
    render: ({ ageBinWidth, gapBinWidth, decadeBinWidth, seqGapBinWidth }) => (
        <div style={{ padding: 24, background: "#f1ead8", minHeight: "100vh" }}>
            <AggregateCharts
                chartData={storyChartData}
                binWidths={{ ageBinWidth, gapBinWidth, decadeBinWidth, seqGapBinWidth }}
            />
        </div>
    ),
}
