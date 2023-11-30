import { PersonDetails } from "../types"
import assumptions from "../assumptions"

const latestBirthYear = assumptions.yearLastPracticed - assumptions.ageOfEligibility

// TODO look at location too
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
