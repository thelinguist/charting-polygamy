import { addFactoid } from "../util"
import { Statistics } from "../types"


const stats: Statistics = {
    eligiblePatriarchs: 0,
    illegallyMarriedPatriarchs: 0,
    patriarchCount: 0,
    polygamousFamilies: 0,
}

export const incrementPatriarchCount = () => {
    stats.patriarchCount++
}

export const incrementPolygamousCount = () => {
    stats.polygamousFamilies++
}

export const incrementEligibilityCount = () => {
    stats.eligiblePatriarchs++
}

export const incrementIllegallyMarriedCount = () => {
    stats.illegallyMarriedPatriarchs++
}

export const reportStats = () => {
    addFactoid("Statistics", "eligible patriarchs", stats.eligiblePatriarchs)
    addFactoid("Statistics", "patriarchs", stats.patriarchCount)
    addFactoid("Statistics", "polygamous families", stats.polygamousFamilies)
    addFactoid("Statistics", "illegal marriages", stats.illegallyMarriedPatriarchs)
    addFactoid("Statistics", "percent of eligible patriarchs who practiced polygamy", `${Math.round(stats.polygamousFamilies / stats.eligiblePatriarchs * 100)}%`)
    return stats
}
