import parse, { HTMLElement } from "node-html-parser"
import { fetchHTMLWithCache } from "../fetch-with-cache"
import { LifeEventEnum } from "lib/src/types"
import { Factoid } from "../types"
import { evenlySpace } from "./cleaners"

const COMMON_USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0"

const getName = (document: HTMLElement, facts: string[]) => {
    const name = document.querySelector('[itemprop="name"]')?.textContent
    return evenlySpace(name ?? facts[0])
}

const parseFacts = (rawHtmlString: string, personToExclude?: string): Factoid[] => {
    const document = parse(rawHtmlString)
    const rows = [...document.querySelectorAll(".VITALS")]
    const facts = rows.map(item => item.textContent.trim())
    let person = getName(document, facts)
    const parsedFacts: Factoid[] = []
    for (let i = 0; i < facts.length; i++) {
        const fact = facts[i]
        if (/^Born\s/i.test(fact)) {
            const [birthdate, birthLocation] = (fact ?? "")
                .replace(/born /i, "")
                .replace(" [location unknown]", "")
                .split(" in ")
            parsedFacts.push({
                Name: person,
                Event: LifeEventEnum.Birth,
                Date: evenlySpace(birthdate),
                Place: birthLocation && evenlySpace(birthLocation),
                "Second Party": undefined,
                Link: undefined,
            })
        }
        if (/^died\s/i.test(fact)) {
            const [date, place] = fact
                .replace(/^died\s/i, "")
                .replace(/\sat\s(about\s)?age\s\d+\s/i, "")
                .replace("[location unknown]", "")
                .split(/in\s/)
            parsedFacts.push({
                Name: person,
                Event: LifeEventEnum.Death,
                Date: date && evenlySpace(date),
                Place: place && evenlySpace(place),
                "Second Party": undefined,
                Link: undefined,
            })
        }
    }
    const spouseEls = document.querySelectorAll("#Spouses .spouse")
    for (const spouseEl of spouseEls) {
        const fact = spouseEl.textContent.trim()
        const [secondParty, rest] = fact.replace(/((husband)|(wife))\sof\s/i, "").split(/—\smarried\s/)
        const [date, place] = (rest ?? "").replace(" [location unknown]", "").split(/\sin\s/i)
        const cleanedSecondParty = evenlySpace(secondParty)
        if (!personToExclude || personToExclude !== cleanedSecondParty) {
            parsedFacts.push({
                Name: person,
                Event: LifeEventEnum.Marriage,
                Date: date && evenlySpace(date),
                Place: place && evenlySpace(place),
                "Second Party": cleanedSecondParty,
                Link: spouseEl.querySelector("a")?.attributes.href?.replace("/wiki/", ""),
            })
        }
    }
    return parsedFacts
}

const fetchOptions = {
    headers: {
        "user-agent": COMMON_USER_AGENT,
        cookie: `aws-waf-token=${process.env.WIKITREE_WAF_TOKEN}`,
        referer: "https://www.wikitree.com/wiki/Special:SearchPerson",
    },
}

const crawlPerson = async (
    slug: string,
    factset: Record<string, Factoid[]>,
    visited: Set<string>,
    personToExclude?: string,
    depth = 0
) => {
    if (visited.has(slug)) return
    visited.add(slug)
    const url = `https://www.wikitree.com/wiki/${slug}`
    const rawHtml = await fetchHTMLWithCache(url, slug, fetchOptions)
    const facts = parseFacts(rawHtml, personToExclude)
    factset[facts[0].Name] = facts
    if (depth === 0) {
        const marriages = facts.filter(fact => fact.Event === LifeEventEnum.Marriage)
        for (const marriage of marriages) {
            if (marriage.Link) {
                await crawlPerson(marriage.Link, factset, visited, facts[0].Name, depth + 1)
            }
        }
    }
}

/**
 *
 * @param slug the URL where this person can be found. Ex "Young-93"
 * @param factset
 * @param personToExclude such as an already discovered patriarch
 */
const getPatriarchAndWives = async (
    slug: string,
    factset: Record<string, Factoid[]> = {},
    personToExclude?: string
) => {
    const visited = new Set<string>()
    await crawlPerson(slug, factset, visited, personToExclude)
    return factset
}

export default {
    getPatriarchAndWives,
}
