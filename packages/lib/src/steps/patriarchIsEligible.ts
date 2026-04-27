import { PersonDetails } from "../types"
import assumptions from "../assumptions"

const latestBirthYear = assumptions.yearLastPracticed - assumptions.ageOfEligibility

/**
 * determine if a closer look into the family should be made based on if the patriarch was eligible when polygamy was openly practiced
 * @param patriarch
 */
export const patriarchIsEligible = (patriarch: PersonDetails): boolean => {
    if (!patriarch) {
        return false
    }
    if (patriarch.birth?.date && patriarch.death?.date) {
        const diedBeforePolygamyStarted = patriarch.death.date.getUTCFullYear() < assumptions.yearFirstPracticed
        const bornAfterPolygamyEnded = patriarch.birth.date.getUTCFullYear() >= latestBirthYear
        return !diedBeforePolygamyStarted && !bornAfterPolygamyEnded
    }
    return false
}
