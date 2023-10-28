import { describe, it, expect } from "vitest"
import { parseTextDate } from ".."

describe("dateTools", function () {
    it.each`
        dateString             | ddMMyyyy
         ${'1800'}              | ${"01/01/1800"}
         ${"17 Sep 1831"}       | ${"09/17/1831"}
         ${"17 September 1831"} | ${"09/17/1831"}
         ${"01 September 1831"} | ${"09/01/1831"}
         ${"1 September 1831"}  | ${"09/01/1831"}
         ${"Aug 30. 1871"}      | ${"08/30/1871"}
         ${"about jun 1843"}    | ${"06/01/1843"}
         ${"abt. 1842"}         | ${"01/01/1842"}
         ${"before 1900"}       | ${"01/01/1899"}
         ${"before jan 1848"}   | ${"12/01/1847"}
         ${"08/17/1830"}        | ${"08/17/1830"}
    `(`parses unformatted date $dateString}`, ({ dateString, ddMMyyyy }) => {
        expect(parseTextDate(dateString, {})).toStrictEqual(new Date(ddMMyyyy))
    })
})

