import type { Meta, StoryObj } from "@storybook/react"
// import { fn } from "@storybook/test"
// import ParentSize from "@visx/responsive/lib/components/ParentSize"

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
        minHeight: { control: "number" },
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

export const spouseWhoIsOlder: Story = {
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
                birth: new Date("1860-09-12"),
                death: new Date("1952-11-01"),
                linkedMarriage: {
                    start: new Date("1890-09-12"),
                },
                otherMarriages: [],
            },
        ],
    },
}

export const Remarriage: Story = {
    args: {
        patriarchTimeline: {
            name: "John Doe",
            birth: new Date("1870-09-12"),
            death: new Date("1950-11-01"),
            marriages: [
                {
                    start: new Date("1890-09-12"),
                    end: new Date("1908-09-12"),
                },
            ],
        },
        timelines: [
            {
                name: "Jane Doe",
                birth: new Date("1868-01-12"),
                death: new Date("1952-11-01"),
                linkedMarriage: {
                    start: new Date("1890-09-12"),
                    end: new Date("1908-09-12"),
                },
                otherMarriages: [
                    {
                        start: new Date("1910-09-12"),
                        end: new Date("1920-09-12"),
                        spouse: "Harry Housen McChallenging",
                    },
                ],
            },
        ],
    },
}

const historicalStory = {
    rootTimeline: {
        name: "Parley Parker Pratt Sr",
        birth: new Date("1807-04-12T06:59:56.000Z"),
        death: new Date("1857-05-15T06:59:56.000Z"),
        marriages: [
            {
                age: 20,
                gap: -10,
                start: new Date("1827-09-09T06:59:56.000Z"),
            },
            {
                age: 30,
                gap: 1,
                start: new Date("1837-05-14T06:59:56.000Z"),
            },
            {
                age: 35,
                gap: 8,
                start: new Date("1843-01-01T06:59:56.000Z"),
            },
            {
                age: 37,
                gap: 11,
                start: new Date("1844-09-09T06:59:56.000Z"),
            },
            {
                age: 37,
                gap: 15,
                start: new Date("1844-10-15T06:59:56.000Z"),
            },
            {
                age: 37,
                gap: 5,
                start: new Date("1844-11-02T06:59:56.000Z"),
            },
            {
                age: 37,
                gap: 13,
                start: new Date("1844-11-20T06:59:56.000Z"),
            },
            {
                age: 38,
                gap: 16,
                start: new Date("1846-01-01T06:59:56.000Z"),
            },
            {
                age: 40,
                gap: 22,
                start: new Date("1847-04-28T06:59:56.000Z"),
            },
            {
                age: 40,
                gap: 18,
                start: new Date("1847-04-28T06:59:56.000Z"),
            },
            {
                age: 45,
                gap: 5,
                start: new Date("1853-01-01T06:59:56.000Z"),
            },
            {
                age: 47,
                gap: 10,
                start: new Date("1855-01-01T06:59:56.000Z"),
            },
        ],
    },
    wives: [
        {
            name: "Thankful Halsey",
            birth: new Date("1797-03-18T06:59:56.000Z"),
            death: new Date("1837-03-25T06:59:56.000Z"),
            linkedMarriage: {
                start: new Date("1827-09-09T06:59:56.000Z"),
                end: new Date("1837-03-25T06:59:56.000Z"),
            },
            age: 30,
            gap: 10,
            otherMarriages: [],
        },
        {
            name: "Mary Ann Frost",
            birth: new Date("1809-01-14T06:59:56.000Z"),
            death: new Date("1891-08-24T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1837-05-14T06:59:56.000Z"),
                end: new Date("1843-06-23T06:59:56.000Z"),
            },
            age: 28,
            gap: -1,
            otherMarriages: [
                {
                    start: new Date("1832-04-01T06:59:56.000Z"),
                    spouse: "Nathan Stearns",
                    end: new Date("1837-05-14T06:59:56.000Z"),
                },
                {
                    start: new Date("1843-06-23T06:59:56.000Z"),
                    spouse: "Joseph Smith Jr",
                    end: new Date("1844-06-27T06:59:56.000Z"),
                },
            ],
        },
        {
            name: "Elizabeth Brotherton",
            birth: new Date("1816-03-27T06:59:56.000Z"),
            death: new Date("1897-05-09T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1843-01-01T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 26,
            gap: -8,
            otherMarriages: [],
        },
        {
            name: "Mary Wood",
            birth: new Date("1818-06-18T06:59:56.000Z"),
            death: new Date("1898-03-05T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1844-09-09T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 26,
            gap: -11,
            otherMarriages: [
                {
                    start: new Date("1840-01-01T06:59:56.000Z"),
                    spouse: "Henry Gibbs",
                    end: new Date("1844-09-09T06:59:56.000Z"),
                },
            ],
        },
        {
            name: "Sarah Houston",
            birth: new Date("1822-08-03T06:59:56.000Z"),
            death: new Date("1886-05-22T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1844-10-15T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 22,
            gap: -15,
            otherMarriages: [],
        },
        {
            name: "Hannahette Snively",
            birth: new Date("1812-10-22T06:59:56.000Z"),
            death: new Date("1898-02-21T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1844-11-02T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 32,
            gap: -5,
            otherMarriages: [],
        },
        {
            name: "Belinda Marden",
            birth: new Date("1820-12-24T06:59:56.000Z"),
            death: new Date("1894-02-19T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1844-11-20T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 23,
            gap: -13,
            otherMarriages: [
                {
                    start: new Date("1840-05-27T06:59:56.000Z"),
                    spouse: "Benjamin Abbott Hilton",
                    end: new Date("1844-07-22T06:59:56.000Z"),
                },
            ],
        },
        {
            name: "Phoebe Elizabeth Sopher",
            birth: new Date("1823-07-08T06:59:56.000Z"),
            death: new Date("1887-09-17T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1846-01-01T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 22,
            gap: -16,
            otherMarriages: [],
        },
        {
            name: "Ann Agatha Walker",
            birth: new Date("1829-06-11T06:59:56.000Z"),
            death: new Date("1908-06-25T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1847-04-28T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 17,
            gap: -22,
            otherMarriages: [
                {
                    start: new Date("1860-03-04T06:59:56.000Z"),
                    spouse: "Joseph Harris Ridges",
                    end: new Date("1908-06-25T07:00:00.000Z"),
                },
            ],
        },
        {
            name: "Martha Monk",
            birth: new Date("1825-04-28T06:59:56.000Z"),
            death: new Date("1894-02-19T07:00:00.000Z"),
            linkedMarriage: {
                start: new Date("1847-04-28T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 22,
            gap: -18,
            otherMarriages: [],
        },
        {
            name: "Keziah Downs",
            birth: new Date("1812-05-10T06:59:56.000Z"),
            death: new Date("1877-01-11T06:59:56.000Z"),
            linkedMarriage: {
                start: new Date("1853-01-01T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 40,
            gap: -5,
            otherMarriages: [],
        },
        {
            name: "Eleanor Jane McComb McLean",
            birth: new Date("1817-12-29T06:59:56.000Z"),
            death: new Date("1874-10-24T06:59:56.000Z"),
            linkedMarriage: {
                start: new Date("1855-01-01T06:59:56.000Z"),
                end: new Date("1857-05-15T06:59:56.000Z"),
            },
            age: 37,
            gap: -10,
            otherMarriages: [
                {
                    start: new Date("1841-01-01T06:59:56.000Z"),
                    spouse: "Hector McLean",
                    end: new Date("1855-01-01T06:59:56.000Z"),
                },
            ],
        },
    ],
}

// accurate data based on apps/ui/public/data/parley-p-pratt.csv
export const ParleyPratt: Story = {
    args: {
        patriarchTimeline: historicalStory.rootTimeline,
        timelines: historicalStory.wives
    },
}
