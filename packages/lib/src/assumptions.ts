/**
 * for example "4 Jul 1999;4 Jul 2000"
 * @param text
 */
const assumeFirstDate = text => text.split(";")[0]

const assumeOrigDate = text => text.split("(")[0].trim()

const ageOfEligibility = 18

// 1852 is when wikipedia says it was openly practiced, but JS declared it to be a practice in 1843, and he invited others in secret to practice.
const polygamyStart = new Date("1843-07-12")

// a second manifesto was issued in 1904 to reiterate the end of the practice
const polygamyEnd = new Date("1890-04-06")

export default {
    polygamyStart,
    polygamyEnd,
    assumeFirstDate,
    assumeOrigDate,
    ageOfEligibility,
}
