
/**
 * for example "4 Jul 1999;4 Jul 2000"
 * @param text
 */
const assumeFirstDate = text => text.split(";")[0]

const assumeOrigDate = text => text.split("(")[0].trim()

const ageOfEligibility = 18

const yearFirstPracticed = 1838

const yearLastPracticed = 1890

export default {
    assumeFirstDate,
    assumeOrigDate,
    ageOfEligibility,
    yearFirstPracticed,
    yearLastPracticed,
}
