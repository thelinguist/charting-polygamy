import { format } from 'date-fns'
import {PatriarchTimeline, Timeline} from '../../types'

const dateFmt = 'yyyy-MM-dd'

export const createChart = ({ rootTimeline, wives }: { rootTimeline: PatriarchTimeline, wives: Timeline[]}) => `
gantt
    title ${rootTimeline.name} and his wives
    todayMarker off
    dateFormat YYYY-MM-DD
    axisFormat %Y
    
    section ${rootTimeline.name}
    life: ${format(rootTimeline.birth, dateFmt)}, ${format(rootTimeline.death, dateFmt)}
${rootTimeline.marriages.map(marriage => `
    age ${marriage.age??''} | gap ${marriage.gap??''}: ${plotMarriage(marriage, true)}`).join('')
}${wives.map(plotWife).join('\n')
}`

const plotWife = wife => `
    section ${wife.name}
    life: ${format(wife.birth!, dateFmt)}, ${format(wife.death!, dateFmt)}
    marriage: ${plotMarriage(wife.linkedMarriage, true)}
    age ${wife.age??''} | gap ${wife.gap??''}: ${plotMarriage(wife.linkedMarriage, false, true)}${wife.otherMarriages.map(marriage => `
    marriage to ${marriage.spouse}: active, ${format(marriage.start, dateFmt)}, ${format(marriage.end, dateFmt)}`).join('')
}`

const plotMarriage = (marriage, isRoot, showStartOnly = false) => {
    if (!marriage.start) {
        return ''
    }
    if (!marriage.end || showStartOnly) {
        return `milestone,done, ${format(marriage.start, dateFmt)}, 1d`
    }
    if (marriage.end && !marriage.start) {
        return `milestone,done, ${format(marriage.end, dateFmt)}, 1d`
    }
    return `${isRoot ? 'crit,' : 'active,'}${format(marriage.start, dateFmt)}, ${format(marriage.end!, dateFmt)}`
}
