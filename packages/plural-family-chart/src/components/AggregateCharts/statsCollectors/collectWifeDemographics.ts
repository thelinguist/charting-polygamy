import type { WifeTimeline, PatriarchMarriage } from "./patriarchTypes"

export function collectWifeDemographics(
    wife: WifeTimeline,
    position: number,
    pMarriage: PatriarchMarriage | undefined,
    allWifeAges: number[],
    firstAges: number[],
    subsequentAges: number[],
    orderAges: Map<number, number[]>,
    ageGaps: number[],
    marriageYears: number[]
): void {
    if (wife.age != null) {
        allWifeAges.push(wife.age)
        if (position === 0) firstAges.push(wife.age)
        else subsequentAges.push(wife.age)

        const bucket = Math.min(position, 3) // 0=1st, 1=2nd, 2=3rd, 3+=4th+
        if (!orderAges.has(bucket)) orderAges.set(bucket, [])
        orderAges.get(bucket)!.push(wife.age)

        if (pMarriage?.age != null) {
            ageGaps.push(pMarriage.age - wife.age)
        }
    }

    if (pMarriage?.start) {
        marriageYears.push(pMarriage.start.getFullYear())
    }
}
