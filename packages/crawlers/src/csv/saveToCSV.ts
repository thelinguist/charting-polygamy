import * as fs from "fs"
import csv from "papaparse"
import { Factoid } from "../types"
import { selectUnique } from "../util/selectUnique"
export const saveToCSV = async (data: Factoid[], fileName: string) => {
  let existingRecords: Factoid[] = []

  try {
    const existingFile = await fs.promises.readFile(fileName)
    existingRecords = csv.parse<Factoid>(existingFile.toString(), { header: true }).data
  } catch (e) {
  }
  const newRecords = selectUnique(existingRecords, data)
  const csvFile = csv.unparse(newRecords, {
    header: existingRecords.length === 0
  })

  return fs.promises.appendFile(fileName, csvFile)
}
