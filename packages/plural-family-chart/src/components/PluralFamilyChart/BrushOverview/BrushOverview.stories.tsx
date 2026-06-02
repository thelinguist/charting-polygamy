import type { Meta, StoryObj } from "@storybook/react-vite"
import { BrushOverview } from "."
import { Group } from "@visx/group"
import { scaleUtc } from "@visx/scale"

const meta = {
    title: "PluralFamily/BrushOverview",
    component: BrushOverview,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        width: { control: "number" },
        patriarchTimeline: { control: "object" },
    },
    decorators: [
        (Story, context) => {
            const { width = 600, height = 40 } = context.args
            return (
                <svg width={width} height={height}>
                    <Group>
                        <Story />
                    </Group>
                </svg>
            )
        },
    ],
} satisfies Meta<typeof BrushOverview>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const MonogamousBrushOverview: Story = {
    args: {
        width: 600,
        height: 40,
        onChange: () => {},
        xScale: scaleUtc({ domain: [new Date("1870-09-12"), new Date("1950-11-01")], range: [0, 600] }),
        patriarchTimeline: {
            name: "John Doe",
            birth: new Date("1870-09-12"),
            death: new Date("1950-11-01"),
            marriages: [
                {
                    start: new Date("1890-09-12"),
                },
            ],
        },
        timelines: [
            {
                name: "Jane Doe",
                birth: new Date("1872-09-12"),
                death: new Date("1952-11-01"),
                linkedMarriage: {
                    start: new Date("1890-09-12"),
                },
                otherMarriages: [],
            },
        ],
    },
}

export const Polygamous: Story = {
    args: {
        width: 600,
        height: 40,
        onChange: () => {},
        xScale: scaleUtc({ domain: [new Date("1870-09-12"), new Date("1950-11-01")], range: [0, 600] }),
        patriarchTimeline: {
            name: "John Doe",
            birth: new Date("1870-09-12"),
            death: new Date("1950-11-01"),
            marriages: [
                {
                    start: new Date("1890-09-12"),
                },
                {
                    start: new Date("1910-09-12"),
                },
            ],
        },
        timelines: [
            {
                name: "Jane Doe",
                birth: new Date("1872-09-12"),
                death: new Date("1952-11-01"),
                linkedMarriage: {
                    start: new Date("1890-09-12"),
                },
                otherMarriages: [],
            },
            {
                name: "Mary Doe",
                birth: new Date("1874-09-12"),
                death: new Date("1954-11-01"),
                linkedMarriage: {
                    start: new Date("1910-09-12"),
                },
                otherMarriages: [],
            },
        ],
    },
}
