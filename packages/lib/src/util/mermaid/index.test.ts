import { describe, it, vi, expect } from "vitest"
import { createChart } from "."
import { PatriarchTimeline, Timeline } from "../../types"
import { addYears } from "date-fns"

const rootTimeline: PatriarchTimeline = {
    name: "root",
    birth: new Date("1870-01-01"),
    death: new Date("1920-01-01"),
    marriages: [
        {
            start: new Date("1889-01-01"),
            gap: 1,
            age: 19,
        },
    ],
}
const wives: Timeline[] = [
    {
        name: "spouse",
        birth: addYears(rootTimeline.birth, 1),
        death: new Date("1930-01-01"),
        age: 18,
        gap: -1,
        linkedMarriage: {
            start: rootTimeline.marriages[0].start!,
            end: rootTimeline.death,
        },
        otherMarriages: [],
    },
]
const polygamist = {
    ...rootTimeline,
    marriages: [
        ...rootTimeline.marriages,
        {
            start: new Date("1890-01-01"),
            gap: 1,
            age: 20,
        },
    ],
}
const polygamistWives: Timeline[] = [
    ...wives,
    {
        name: "spouse2",
        birth: addYears(wives[0].birth, 1),
        death: new Date("1931-01-01"),
        age: 17,
        gap: -2,
        linkedMarriage: {
            start: polygamist.marriages[1].start!,
            end: polygamist.death,
        },
        otherMarriages: [],
    },
]
describe("createChart", () => {
    it("should create a chart for traditional marriage", () => {
        const chart = createChart({ rootTimeline, wives })
        expect(chart).toMatchInlineSnapshot(`
          "
          gantt
          	title root and his wives
          	todayMarker off
          	dateFormat YYYY-MM-DD
          	axisFormat %Y
              
          	section root
          	life: 1870-01-01, 1920-01-01
          	age 19 | 1 years older: milestone,done, 1889-01-01, 1d
          	section spouse
          	life: 1871-01-01, 1930-01-01
          	marriage: crit,1889-01-01, 1920-01-01
          	age 18 | 1 years younger: milestone,done, 1889-01-01, 1d
          	"
        `)
    })

    it("should create a chart for polygamist family", () => {
        const chart = createChart({ rootTimeline: polygamist, wives: polygamistWives })

        // wrong indentation is expected and has to do with inline snapshot
        expect(chart).toMatchInlineSnapshot(`
          "
          gantt
          	title root and his wives
          	todayMarker off
          	dateFormat YYYY-MM-DD
          	axisFormat %Y
              
          	section root
          	life: 1870-01-01, 1920-01-01
          	age 19 | 1 years older: milestone,done, 1889-01-01, 1d
          	age 20 | 1 years older: milestone,done, 1890-01-01, 1d
          	section spouse
          	life: 1871-01-01, 1930-01-01
          	marriage: crit,1889-01-01, 1920-01-01
          	age 18 | 1 years younger: milestone,done, 1889-01-01, 1d
          	
          	section spouse2
          	life: 1872-01-01, 1931-01-01
          	marriage: crit,1890-01-01, 1920-01-01
          	age 17 | 2 years younger: milestone,done, 1890-01-01, 1d
          	"
        `)
    })

    it("handles missing marriage info", () => {
        const wives = [...polygamistWives]
        // @ts-ignore
        wives[1].linkedMarriage.start = undefined
        const chart = createChart({ rootTimeline: polygamist, wives })
        const [_, spouse2] = chart.split("section spouse2")
        expect(chart).toContain("title root and his wives")
        expect(spouse2).not.toContain("marriage:")
    })
})
