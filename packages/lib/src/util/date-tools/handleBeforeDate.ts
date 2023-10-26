import { addMonths, addYears, parse } from "date-fns"
import { beforeMatcher, missingDate, yearOnly } from "./regex"
import { FactRecord } from "../../types"
import { UserIntervention } from "../user-intervention"

export function handleBeforeDate(text: string, existingFact: Partial<FactRecord>) {
    text = text.replace(beforeMatcher, "")
    if (yearOnly.test(text)) {
        const year = text
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: "Date",
            reason: `"before" ${year} specified. assuming one year prior`,
        })

        const date = parse(year, "yyyy", new Date())
        return addYears(date, -1)
    }
    if (missingDate.test(text)) {
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: "Date",
            reason: `"before" date specified. assuming one month prior`,
        })

        const date = parse(text, "MMMM yyyy", new Date())
        return addMonths(date, -1)
    }
    throw new Error(`unrecognizable date format ${text}`)
}
