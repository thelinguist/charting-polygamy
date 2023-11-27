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
    title ${rootTimeline.name} and his wives
    todayMarker off
    dateFormat YYYY-MM-DD
    axisFormat %Y
    
    section ${rootTimeline.name}
    life: ${format(rootTimeline.birth, dateFmt)}, ${format(rootTimeline.death, dateFmt)}
${rootTimeline.marriages
    .map(
        marriage => `
    age ${marriage.age ?? ""} | ${calcGap(marriage.gap)}: ${plotMarriage(marriage, true)}`
    )
    .join("")}${wives.map(plotWife).join("\n")}`

const plotWife = (wife: Timeline) => {
    try {
        return `
    section ${wife.name}
    life: ${format(wife.birth!, dateFmt)}, ${format(wife.death!, dateFmt)}
    marriage: ${plotMarriage(wife.linkedMarriage, true)}
    age ${wife.age ?? ""} | ${calcGap(wife.gap)}: ${plotMarriage(
        wife.linkedMarriage,
        false,
        true
    )}${wife.otherMarriages
        .map(
            marriage => `
    marriage to ${marriage.spouse}: active, ${format(marriage.start, dateFmt)}, ${format(marriage.end, dateFmt)}`
        )
        .join("")}`
    } catch (e) {
        if (e instanceof Error) {
            e.message = `error plotting wife, ${wife.name}: ${e.message}`
        }
        throw e
    }
}

const plotMarriage = (marriage, isRoot, showStartOnly = false) => {
    if (!marriage.start) {
        return ""
    }
    if (!marriage.end || showStartOnly) {
        return `milestone,done, ${format(marriage.start, dateFmt)}, 1d`
    }
    if (marriage.end && !marriage.start) {
        return `milestone,done, ${format(marriage.end, dateFmt)}, 1d`
    }
    return `${isRoot ? "crit," : "active,"}${format(marriage.start, dateFmt)}, ${format(marriage.end!, dateFmt)}`
}
