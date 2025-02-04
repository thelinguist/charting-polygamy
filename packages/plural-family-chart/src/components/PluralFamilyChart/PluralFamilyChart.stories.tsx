import type { Meta, StoryObj } from "@storybook/react"
// import { fn } from "@storybook/test"
import ParentSize from "@visx/responsive/lib/components/ParentSize"

import { PluralFamilyChart } from "."
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "PluralFamilyChart",
    // component: () => <ParentSize>{({ width, height }) => <PluralFamilyChart width={width} height={height} />}</ParentSize>,
    component: PluralFamilyChart,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // More on argTypes: https://storybook.js.org/docs/api/argtypes
    argTypes: {
        width: { control: "number" },
        height: { control: "number" },
        patriarchTimeline: { control: "object" },
    },
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    // args: { onClick: fn() },
} satisfies Meta<typeof PluralFamilyChart>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Monogamous: Story = {
    args: {
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
