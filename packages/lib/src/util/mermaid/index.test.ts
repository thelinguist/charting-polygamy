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

    it('handles missing marriage info', () => {
        const values = `
        gantt
\ttitle Allen Joseph Stout and his wives
\ttodayMarker off
\tdateFormat YYYY-MM-DD
\taxisFormat %Y
    
\tsection Allen Joseph Stout
\tlife: 1815-12-05, 1889-12-18
\tage -30 | 50 years younger: milestone,done, 1785-01-01, 1d
\tage -18 | 38 years younger: milestone,done, 1797-01-01, 1d
\tage 27 | 7 years older: milestone,done, 1843-07-17, 1d
\tage 32 | 16 years older: milestone,done, 1848-04-30, 1d
\t
\tsection Margaret Stout
\tlife: 1765-09-11, 1828-01-01
\tmarriage: crit,1785-01-01, 1828-01-01
\tage 19 | 50 years older: milestone,done, 1785-01-01, 1d
\t
\tsection Rachael Stout
\tlife: 1777-06-23, 1827-06-26
\tmarriage: crit,1797-01-01, 1827-06-26
\tage 19 | 38 years older: milestone,done, 1797-01-01, 1d
\t
\tsection Elizabeth Anderson
\tlife: 1823-10-13, 1848-01-30
\tmarriage: crit,1843-07-17, 1848-01-30
\tage 19 | 7 years younger: milestone,done, 1843-07-17, 1d
\t
\tsection Amanda Melvina Fisk
\tlife: 1832-06-12, 1888-09-21
\tmarriage: crit,1848-04-30, 1888-09-21
\tage 15 | 16 years younger: milestone,done, 1848-04-30, 1d
\t
\tsection Rebecca Smith
\tlife: 1785-06-09, 1835-09-01
\tmarriage: `
    })
})
