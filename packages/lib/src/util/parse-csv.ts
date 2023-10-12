import csv from 'papaparse'
import {FactRecord} from '../types'

export const parseCsv = (fileContents: string): FactRecord[] => {
    const records = csv.parse(fileContents,  { header: true })
    return records.data
}
