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
        if (/^(husband)|(wife)\sof\s/i.test(fact)) {
            const [secondParty, rest] = fact.replace(/((husband)|(wife))\sof\s/i, "").split(/—\smarried\s/)
            const [date, place] = rest.replace(" [location unknown]", "").split(/\sin\s/i)
            const cleanedSecondParty = evenlySpace(secondParty)
            if (!personToExclude || personToExclude !== cleanedSecondParty) {
                parsedFacts.push({
                    Name: person,
                    Event: LifeEventEnum.Marriage,
                    Date: date && evenlySpace(date),
                    Place: place && evenlySpace(place),
                    "Second Party": cleanedSecondParty,
                    Link: rows[i].querySelector("a")?.attributes.href?.replace("/wiki/", ""),
                })
            }
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
    return parsedFacts
}

/**
 *
 * @param slug the URL where this person can be found. Ex "Young-93"
 * @param factset
 * @param personToExclude such as an already discovered patriarch
 */
const getPatriarchAndWives = async (slug: string, factset = {}, personToExclude?: string) => {
    const url = `https://wikitree.com/wiki/${slug}`
    const rawHtml = await fetchHTMLWithCache(url, slug, {
        headers: {
            "user-agent": COMMON_USER_AGENT,
        },
    })
    const facts = parseFacts(rawHtml, personToExclude)
    factset[facts[0].Name] = facts
    if (!personToExclude) {
        const marriages = facts.filter(fact => fact.Event === LifeEventEnum.Marriage)
        for (const marriage of marriages) {
            if (marriage.Link) {
                await getPatriarchAndWives(marriage.Link, factset, marriage.Name)
            }
        }
    }
    return factset
}

export default {
    getPatriarchAndWives,
}
