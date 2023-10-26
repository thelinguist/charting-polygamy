const convertYearOnlyDate = text => `1 jan ${text}`

/**
 * for example "Sep 1999"
 * @param text
 */
const convertMonthYearOnlyDate = text => `1 ${text}`

/**
 * for example "4 Jul 1999;4 Jul 2000"
 * @param text
 */
const assumeFirstDate = text => text.split(";")[0]

const assumeOrigDate = text => text.split("(")[0].trim()

export default {
    convertMonthYearOnlyDate,
    convertYearOnlyDate,
    assumeFirstDate,
    assumeOrigDate,
}
