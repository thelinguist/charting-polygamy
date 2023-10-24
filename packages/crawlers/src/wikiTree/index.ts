import parse from "node-html-parser"
import { fetchHTMLWithCache } from "../fetch-with-cache"
import { LifeEventEnum } from "lib/src/types"
import { Factoid } from "../types"
import { evenlySpace } from "./cleaners"

const COMMON_USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'

const parseFacts = (rawHtmlString: string): Factoid[] => {
  const document = parse(rawHtmlString)
  const rows = [...document.querySelectorAll(".VITALS")]
  const facts = rows.map(item => item.textContent.trim())
  const person = evenlySpace(facts[0])
  const parsedFacts: Factoid[] = []
  for (let i = 0; i < facts.length; i++) {
    const fact = facts[i]
    if (/^Born\s/i.test(fact)) {
      const [birthdate, birthLocation] = (fact ?? '')
        .replace(/born /i, '')
        .replace(' [location unknown]','')
        .split(' in ')
      parsedFacts.push({
        Name: person,
        Event: LifeEventEnum.Birth,
        Date: evenlySpace(birthdate),
        Place: birthLocation && evenlySpace(birthLocation),
        "Second Party": undefined,
        Link: undefined
      })
    }
    if (/^Husband\sof\s/i.test(fact)) {
      const [secondParty, rest] = fact.replace(/husband\sof\s/i, '').split(/—\smarried\s/)
      const [date, place] = rest.replace(' [location unknown]', '').split(/\sin\s/i)
      parsedFacts.push({
        Name: person,
        Event: LifeEventEnum.Marriage,
        Date: date && evenlySpace(date),
        Place: place && evenlySpace(place),
        "Second Party": secondParty && evenlySpace(secondParty),
        Link: rows[i].querySelector('a')?.attributes.href?.replace('/wiki/', '')
      })
    }
  }
  return parsedFacts
}

/**
 *
 * @param slug the URL where this person can be found. Ex "Young-93"
 * @param factset
 */
const getPatriarchAndWives = async (slug: string, factset = {}) => {
  const url = `https://wikitree.com/wiki/${slug}`
  const rawHtml = await fetchHTMLWithCache(url, slug, {
    headers: {
      'user-agent': COMMON_USER_AGENT
    }
  })
  const facts = parseFacts(rawHtml)
  factset[facts[0].Name] = facts
  const marriages = facts.filter(fact => fact.Event === LifeEventEnum.Marriage)
    for (const marriage of marriages) {
      if (marriage.Link) {
        await getPatriarchAndWives(marriage.Link, factset)
      }
    }
  return factset
}

export default {
  getPatriarchAndWives
}