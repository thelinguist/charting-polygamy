import { FactRecord, KnowledgeTree, LifeEventEnum, PersonDetails } from "../types"
import { addFactoid } from "../util"

/**
 * @param {Object[]} facts
 * @param facts[].Name full name
 * @param facts[].Event 'Death',
 * @param facts[].Date ex '1912-11-12',
 * @param facts[]['Second Party'] '',
 * @param facts[].Note
 */
export const createKnowledgeTree = (facts: FactRecord[]) => {
    const tree: KnowledgeTree = {}
    for (const fact of facts) {
        const person = fact.Name
        const event = fact.Event
        const dateString = fact.Date
        const date = dateString ? new Date(dateString) : undefined
        const secondPerson = fact["Second Party"]
        const note = fact.Note
        if (!tree[person]) {
            tree[person] = {
                name: person,
                marriages: {},
                divorces: {},
            } as PersonDetails
        }
        if (secondPerson && !tree[secondPerson]) {
            tree[secondPerson] = {
                name: secondPerson,
                marriages: {},
                divorces: {},
            } as PersonDetails
        }
        if (note) {
            addFactoid(person, event, note)
        }
        switch (event) {
            case LifeEventEnum.Divorce:
                if (!secondPerson) {
                    throw new Error(`found a divorce but only one party, ${person}`)
                }
                tree[person].divorces[secondPerson] = {
                    date,
                    person: secondPerson,
                    note,
                }
                tree[secondPerson].divorces[person] = {
                    date,
                    person,
                    note,
                }
                break
            case LifeEventEnum.Marriage:
                if (!secondPerson) {
                    throw new Error(`found a marriage but only one party, ${person}`)
                }
                tree[person].marriages[secondPerson] = {
                    date,
                    person: secondPerson,
                    note,
                }
                tree[secondPerson].marriages[person] = {
                    date,
                    person,
                    note,
                }
                break
            case LifeEventEnum.Birth:
                tree[person].birth = {
                    date,
                }
                if (note) {
                    tree[person].birth!.note = note
                }
                break
            case LifeEventEnum.Death:
                tree[person].death = {
                    date,
                }
                if (note) {
                    tree[person].death!.note = note
                }
                break
        }
    }
    return tree
}
