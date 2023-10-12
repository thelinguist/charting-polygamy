import {getFactoids, charting} from '../util'

export const chart = (timelines, debugMode, patriarchName) => {
    // do the detection step
    const chart = charting.createChart(timelines)

    if (!debugMode) {
        const filename = `${patriarchName}.md`
        charting.save(chart, filename, getFactoids())
    } else {
        charting.pipe(chart)
    }
}
