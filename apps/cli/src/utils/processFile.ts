import fs from 'fs'
export const parseFile = (fileName: string): string => {
    const file = fs.readFileSync(fileName)
    return file.toString()
}
