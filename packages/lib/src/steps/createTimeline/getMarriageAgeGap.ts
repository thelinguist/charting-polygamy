import { PersonDetails } from "../../types"
import { differenceInYears } from "date-fns"

export const getMarriageAgeGap = (person: PersonDetails, spouse: PersonDetails) => {
    const marriage = person.marriages[spouse.name]
    const birth = person.birth?.date
    const spouseBirth = spouse.birth?.date
    if (!birth || !spouseBirth || !marriage?.date) {
        console.warn(`${person.name} is missing dates for marriage with ${spouse.name}`)
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
