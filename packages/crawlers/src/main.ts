import wikiTree from "./wikiTree"
import { saveToCSV } from "./csv/saveToCSV"
import { Factoid } from "./types"

const famousPolygamists = {
    "BrighamYoung": "Young-93"
}

const factsFile = 'facts.csv'

export const main = async () => {
    const data = await wikiTree.getPatriarchAndWives(famousPolygamists['BrighamYoung'], {}, true)
    const facts = Object.values(data).flat() as Factoid[]
    await saveToCSV(facts, factsFile)
}
main()
