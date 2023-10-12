import {format, parse} from 'date-fns'
import {UserIntervention} from './user-intervention'
import {FactRecord} from '../types'
import assumptions from '../assumptions'

const danishMay = /[Mm]aj /
const altSeptember = /[Ss]ept /
const missingDate = /^\w+ \d{4}$/
const multiDate = /.+;.+/
const altDate = /.+\(.+\)\s*/
const yearOnly = /^\d{4}$/
const approxYear = /[Aa][Bb][Oo]?[Uu]?[Tt]\.? \d{4}/

// format matchers
const dateFirstMatcher = /\d{1,2} \w{3,9} \d{4}/
const monthFirstMatcher = /\w{3,9} \d{1,2} \d{4}/

/**
 * TODO guess locale of dateText if not English, given a prioritized list of locales
 * @param text
 * @param locale
 * @param existingFact
 */
export const parseTextDate = (text: string, existingFact: Partial<FactRecord>, locale?: string): Date => {
    if (locale && locale !== 'en-US') {
        throw new Error(`${locale} not implemented`)
    }

    text = text.replaceAll(/[,.]/g,'').toLowerCase()

    if (yearOnly.test(text)) {
        text = `1 jan ${text}`
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: 'Date',
            reason: `only year specified. assuming ${text}`
        })
    }

    if (approxYear.test(text)) {
        const [matches] = [...text.matchAll(/\d{4}/g)]
        text = `1 jan ${matches}`
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: 'Date',
            reason: `approximate year specified. assuming ${text}`
        })
    }
    if (missingDate.test(text)) {
        text = assumptions.convertMonthYearOnlyDate(text)
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: 'Date',
            reason: `no date specified. assuming ${text}`
        })
    }
    if (multiDate.test(text)) {
        const oldText = text
        text = assumptions.assumeFirstDate(text)
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: 'Date',
            reason: `many dates specified: ${oldText}. assuming first one: ${text}`
        })
    }
    if (altDate.test(text)) {
        const oldText = text
        text = assumptions.assumeOrigDate(text)
        UserIntervention.addIssue({
            canMakeAssumption: true,
            fact: existingFact,
            issueWith: 'Date',
            reason: `alternative date specified: ${oldText}. assuming first one: ${text}`
        })
    }

    if (danishMay.test(text)) {
        text = text.replace(danishMay, 'may ')
    }
    else if (altSeptember.test(text)) {
        text = text.replace(altSeptember, 'sep ')
    }

    if (dateFirstMatcher.test(text)) {
        return parse(text, 'd MMMM yyyy', new Date())
    } else if (monthFirstMatcher.test(text)) {
        return parse(text, 'MMMM d yyyy', new Date())
    } else {
        throw new Error(`unrecognizable date format ${text}`)
    }
}

export const dateToMMDDYYYY = (date: Date) => format(date, 'MM/dd/yyyy')
