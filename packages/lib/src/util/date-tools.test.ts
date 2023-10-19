import { describe, it, expect } from "vitest"
import { parseTextDate } from "./date-tools"

describe("dateTools", function () {
    it.each`
        dateString             | ddMMyyyy
        ${"17 Sep 1831"}       | ${"09/17/1831"}
        ${"17 September 1831"} | ${"09/17/1831"}
        ${"01 September 1831"} | ${"09/01/1831"}
        ${"1 September 1831"}  | ${"09/01/1831"}
        ${"Aug 30. 1871"}      | ${"08/30/1871"}
    `(`parses unformatted date $dateString}`, ({ dateString, ddMMyyyy }) => {
        expect(parseTextDate(dateString, {})).toStrictEqual(new Date(ddMMyyyy))
    })
})
