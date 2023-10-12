import {PatriarchalFamily, FileTypes} from '../types'
import path from 'path'
import {parseCsv, parseGedcom} from '../util'

const determineFormat = (fileFormat, inputFile: string): FileTypes => {
    if (fileFormat === 'ged' || (!fileFormat && path.extname(inputFile) === '.ged')) {
        return FileTypes.ged
    }
    if (fileFormat === 'csv' || (!fileFormat && path.extname(inputFile) === '.csv')) {
        return FileTypes.csv
    }
    throw new Error('could not determine format to read family tree')
}

const getFacts = (inputFile: string, format: FileTypes, patriarchName?: string): PatriarchalFamily[] => {
    if (format === FileTypes.ged) {
        return parseGedcom(inputFile, patriarchName)
    } else if (format === FileTypes.csv && patriarchName) {
        return [{
            facts: parseCsv(inputFile),
            patriarchName
        }]
    }
    throw new Error('could not find any facts from the files given')
}

export const createDB = (inputFile: string, fileFormat: FileTypes|string, patriarchName?: string) => {
    const format = determineFormat(fileFormat, inputFile)
    return getFacts(inputFile, format, patriarchName)
}
