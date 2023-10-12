import fs from 'fs'
import csv from 'papaparse'
import {FactRecord} from '../types'

export const parseCsv = (fileName): FactRecord[] => {
    const file = fs.readFileSync(fileName)
    const records = csv.parse(file.toString(),  { header: true })
    return records.data
}
