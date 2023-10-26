
/**
 * for example "4 Jul 1999;4 Jul 2000"
 * @param text
 */
const assumeFirstDate = text => text.split(";")[0]

const assumeOrigDate = text => text.split("(")[0].trim()


export default {
    assumeFirstDate,
    assumeOrigDate,
}
