import { format, parse } from "date-fns"
import { UserIntervention } from "../user-intervention"
import { FactRecord } from "../../types"
import assumptions from "../../assumptions"
import {
    altDate,
    altSeptember,
    beforeMatcher,
    danishMay,
    dateFirstMatcher,
    missingDate,
    monthFirstMatcher,
    multiDate,
    yearOnly,
} from "./regex"
import { handleBeforeDate } from "./handleBeforeDate"

/**
 * TODO guess locale of dateText if not English, given a prioritized list of locales
 * @param text
 * @param locale
 * @param existingFact
 */
export const parseTextDate = (text: string, existingFact: Partial<FactRecord>, locale?: string): Date => {
    if (locale && locale !== "en-US") {
        throw new Error(`${locale} not implemented`)
    }

    text = text.replaceAll(/[,.]/g, "").toLowerCase()
    text = text.replace(/ab(ou)?t?\.?\s+/i, "")

    if (yearOnly.test(text)) {
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: "Date",
            reason: `only year specified. assuming jan 1 ${text}`,
        })
        return parse(text, "yyyy", new Date())
    }

    if (beforeMatcher.test(text)) {
        return handleBeforeDate(text, existingFact)
    }

    if (missingDate.test(text)) {
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: "Date",
            reason: `no date specified. assuming 1 ${text}`,
        })
        return parse(text, "MMMM yyyy", new Date())
    }

    if (multiDate.test(text)) {
        const oldText = text
        text = assumptions.assumeFirstDate(text)
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: "Date",
            reason: `many dates specified: ${oldText}. assuming first one: ${text}`,
        })
    } else if (altDate.test(text)) {
        const oldText = text
        text = assumptions.assumeOrigDate(text)
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: "Date",
            reason: `alternative date specified: ${oldText}. assuming first one: ${text}`,
        })
    }

    if (danishMay.test(text)) {
        text = text.replace(danishMay, "may ")
    } else if (altSeptember.test(text)) {
        text = text.replace(altSeptember, "sep ")
    }

    if (dateFirstMatcher.test(text)) {
        return parse(text, "d MMMM yyyy", new Date())
    } else if (monthFirstMatcher.test(text)) {
        return parse(text, "MMMM d yyyy", new Date())
    } else {
        throw new Error(`unrecognizable date format ${text}`)
    }
}

export const dateToMMDDYYYY = (date: Date) => format(date, "MM/dd/yyyy")
