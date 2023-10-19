import { FactRecord } from "../../types"

export interface MissingFact {
    fact: Partial<FactRecord>
    issueWith: keyof FactRecord
    canMakeAssumption?: boolean
    reason?: string
}

/**
 * This singleton class should manage any issues that arise that the user should provide more input on.
 * These are assumptions that the program could make or decisions that cannot be made with the given data
 *
 * At the end of the flow the class will provide this list of issues for the user to quickly respond. The program should be able to use these updates
 */
export class UserIntervention {
    static singleton: UserIntervention
    private missingFacts: MissingFact[]
    constructor() {
        this.missingFacts = []
    }

    static addIssue(missingFact: MissingFact) {
        UserIntervention.getInstance().missingFacts.push(missingFact)
    }

    static getIssues() {
        return UserIntervention.getInstance().missingFacts
    }

    static reset() {
        UserIntervention.getInstance().missingFacts = []
    }

    private static getInstance() {
        if (!UserIntervention.singleton) {
            UserIntervention.singleton = new UserIntervention()
        }
        return UserIntervention.singleton
    }
}
