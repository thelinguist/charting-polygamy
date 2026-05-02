import { PatriarchData } from "lib"

export const example3WivesChartData: Record<string, PatriarchData> = {
    Patriarch: {
        patriarchTimeline: {
            name: "Patriarch",
            birth: new Date("1817-05-03"),
            death: new Date("1881-07-09"),
            marriages: [
                { age: 25, gap: 11, start: new Date("1841-02-23"), end: new Date("1881-06-01") },
                { age: 30, gap: 19, start: new Date("1846-01-20"), end: new Date("1870-03-16") },
                { age: 41, gap: 22, start: new Date("1857-03-10"), end: new Date("1858-01-01") },
            ],
        },
        timelines: [
            {
                name: "Female 1",
                birth: new Date("1826-01-14"),
                death: new Date("1891-03-10"),
                linkedMarriage: { start: new Date("1841-02-23"), end: new Date("1881-06-01") },
                otherMarriages: [],
                age: 14,
                gap: 11,
            },
            {
                name: "Female 2",
                birth: new Date("1834-04-07"),
                death: new Date("1870-03-16"),
                linkedMarriage: { start: new Date("1846-01-20"), end: new Date("1870-03-16") },
                otherMarriages: [],
                age: 11,
                gap: 19,
            },
            {
                name: "Female 3",
                birth: new Date("1837-10-25"),
                death: new Date("1898-01-08"),
                linkedMarriage: { start: new Date("1857-03-10"), end: new Date("1858-01-01") },
                otherMarriages: [{ start: new Date("1858-01-01"), end: new Date("1898-01-08"), spouse: "Other male" }],
                age: 19,
                gap: 22,
            },
        ],
    },
}
