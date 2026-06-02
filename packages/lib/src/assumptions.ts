/**
 * for example "4 Jul 1999;4 Jul 2000"
 * @param text
 */
const assumeFirstDate = text => text.split(";")[0]

const assumeOrigDate = text => text.split("(")[0].trim()

const ageOfEligibility = 18

// 1833 is the earliest documented estimate for when Joseph Smith began practicing plural marriage (Fanny Alger).
// The practice was publicly announced on 1852-08-29 and formally recorded in D&C 132 on 1843-07-12.
const polygamyStart = new Date("1833-01-01")

// a second manifesto was issued in 1904 to reiterate the end of the practice
const polygamyEnd = new Date("1890-04-06")

export default {
    polygamyStart,
    polygamyEnd,
    assumeFirstDate,
    assumeOrigDate,
    ageOfEligibility,
}
