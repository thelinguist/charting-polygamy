import { getTimelines, MissingFact, PatriarchData, SkippedFamily } from "lib"
import { Statistics } from "lib/src/types"
import { parseFile } from "./index"
import { getFileFormat } from "./getFileFormat"

const PARSE_TIMEOUT_MS = 30_000

export interface FileParseResult {
    chartData: Record<string, PatriarchData>
    monogamousData: Record<string, PatriarchData>
    stats: Statistics
    skippedFamilies: SkippedFamily[]
    interventions: MissingFact[]
}

/**
 * Reads, validates, and parses an uploaded GEDCOM or CSV file.
 * Rejects if the file takes longer than 30 seconds to process.
 * Yields to the browser after file reading so any loading UI can paint
 * before the synchronous getTimelines work blocks the main thread.
 */
export async function processUploadedFile(file: File): Promise<FileParseResult> {
    const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(
            () => reject(new Error("Processing timed out. Your file may be too large or contain unsupported data.")),
            PARSE_TIMEOUT_MS
        )
    })

    const fileContents = await Promise.race([parseFile(file, console.info), timeoutPromise])
    const fileFormat = getFileFormat(file)

    // Yield to the browser so any loading UI can paint before the synchronous
    // getTimelines call blocks the main thread.
    await new Promise<void>(resolve => setTimeout(resolve, 0))

    const { chartData, monogamousData, stats, skippedFamilies, errors } = getTimelines({
        fileContents,
        fileFormat,
        includeMonogamous: true,
    })

    return { chartData, monogamousData, stats, skippedFamilies, interventions: errors }
}
