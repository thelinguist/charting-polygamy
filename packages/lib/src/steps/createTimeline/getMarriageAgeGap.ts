import { PersonDetails } from "../../types"
import { differenceInYears } from "date-fns"
import { UserIntervention } from "../../util"

const findExistingBirthDateFact = (person: PersonDetails) =>
    UserIntervention.getIssues().some(
        i => i.fact.Name === person.name && i.reason?.includes(`${person.name}'s birth date`)
    )

/**
 * get the age gap between the marriage and the person's birth. Report missing facts.
 * @param person
 * @param spouse
 */
export const getMarriageAgeGap = (person: PersonDetails, spouse: PersonDetails) => {
    const marriage = person.marriages[spouse.name]
    const birth = person.birth?.date
    const spouseBirth = spouse.birth?.date
    if (!birth || !spouseBirth || !marriage?.date) {
        const alreadyReportedBirth = !birth && findExistingBirthDateFact(person)
        const missingFacts: string[] = []
        if (!birth && !alreadyReportedBirth) missingFacts.push(`${person.name}'s birth date`)
        if (!spouseBirth) missingFacts.push(`${spouse.name}'s birth date`)
        if (!marriage?.date) missingFacts.push(`marriage date for ${person.name} & ${spouse.name}`)
        if (missingFacts.length > 0) {
            UserIntervention.addIssue({
                fact: { Name: person.name, "Second Party": spouse.name },
                issueWith: "Date",
                reason: `missing ${missingFacts.join("; ")} — age gap cannot be calculated`,
            })
        }
        return {}
    }
    const age = differenceInYears(marriage?.date, birth)
    const gap = differenceInYears(spouseBirth, birth)
    return {
        age,
        gap,
        start: marriage.date,
    }
}
