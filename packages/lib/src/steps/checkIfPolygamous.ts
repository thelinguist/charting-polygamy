import {Timeline} from '../types'

// TODO allow for posthumous polygamy
/**
 * does AB collision detection to determine if concurrent marriages were happening
 * @param timelines
 */
export const checkIfPolygamous = (timelines: Timeline[]): boolean => {
    if (timelines.length === 1) {
        return false
    }
    for (let i = 0; i < timelines.length; i++) {
        for (let j = i; j < timelines.length; j++) {
            const startI = timelines[i].linkedMarriage.start
            const startJ = timelines[j].linkedMarriage.start
            const endI = timelines[i].linkedMarriage.end
            const endJ = timelines[j].linkedMarriage.end

            if (!startI || !startJ || !endI || !endJ) {
                continue
            }

            // i       -----
            // j   ------
            if (startI > startJ && startI < endJ) {
                return true
            }

            // i   ------
            // j       -----
            if (startJ > startI && startJ < endI) {
                return true
            }
        }
    }
    return false
}
