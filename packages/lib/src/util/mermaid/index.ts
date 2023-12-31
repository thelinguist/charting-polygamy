import { format } from "date-fns"
import { PatriarchTimeline, Timeline } from "../../types"

const dateFmt = "yyyy-MM-dd"

const calcGap = (gap: number | undefined) => {
    if (!gap) {
        return ""
    }
    if (gap < 0) {
        return `${Math.abs(gap)} years younger`
    }
    return `${gap} years older`
}

export const createChart = ({ rootTimeline, wives }: { rootTimeline: PatriarchTimeline; wives: Timeline[] }) => `
gantt
\ttitle ${rootTimeline.name} and his wives
\ttodayMarker off
\tdateFormat YYYY-MM-DD
\taxisFormat %Y
    
\tsection ${rootTimeline.name}
\tlife: ${format(rootTimeline.birth, dateFmt)}, ${format(rootTimeline.death, dateFmt)}
\t${rootTimeline.marriages.map(marriage => plotMilestone(marriage)).join("\n\t")}
\t${wives.map(plotWife).join("\n\t")}`

const plotWife = (wife: Timeline) => {
    try {
        return [
            `section ${wife.name}`,
            `life: ${format(wife.birth!, dateFmt)}, ${format(wife.death!, dateFmt)}`,
            plotMarriage(wife.linkedMarriage),
            plotMilestone({ age: wife.age, gap: wife.gap, start: wife.linkedMarriage.start }),
            plotExternalMarriages(wife),
        ].join("\n\t")
    } catch (e) {
        if (e instanceof Error) {
            e.message = `error plotting wife, ${wife.name}: ${e.message}`
        }
        throw e
    }
}

/**
 * plots marriages not involving the root patriarch
 * @param wife
 */
const plotExternalMarriages = (wife: Timeline) =>
    wife.otherMarriages
        .map(
            marriage =>
                `marriage to ${marriage.spouse}: active, ${format(marriage.start, dateFmt)}, ${format(
                    marriage.end,
                    dateFmt
                )}`
        )
        .join("\n")

const plotMarriage = (marriage, showStartOnly = false) => {
    if (!marriage.start) {
        return ""
    }
    if (!marriage.end || showStartOnly) {
        return `marriage: milestone,done, ${format(marriage.start, dateFmt)}, 1d`
    }
    if (marriage.end && !marriage.start) {
        return `marriage: milestone,done, ${format(marriage.end, dateFmt)}, 1d`
    }
    return `marriage: crit,${format(marriage.start, dateFmt)}, ${format(
        marriage.end!,
        dateFmt
    )}`
}

const plotMilestone = marriage => {
    if (!marriage.start) {
        return ""
    }
    return `age ${marriage.age ?? ""} | ${calcGap(marriage.gap)}: milestone,done, ${format(
        marriage.start,
        dateFmt
    )}, 1d`
}
