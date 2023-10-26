#!/usr/bin/env ts-node

import { Command } from "commander"
import { getTimelinesForMermaid } from "lib"
import packageJson from "../package.json"
import { splash } from "./utils/splash"
import { parseFile } from "./utils/processFile"
import { determineFormat } from "./utils/determineFormat"
import { getFactoids } from "lib/src/util"
import { saveToFile } from "./utils/saveToFile"
import { stdout } from "./utils/stdout"

interface CommandOpts {
    factsFile: string
    name: string
    fileFormat: string
    allowFemaleConcurrentMarriages: boolean
    debug: boolean
}

const program = new Command()
program
    .version(packageJson.version)
    .description("A tool for analyzing polygamy in genealogy files")
    .argument("<inputFile>", "the input file (csv or gedcom)")
    .option(
        "-f, --file-format  [value]",
        "file format. valid options are 'csv' and 'ged'. The program automatically detects format, but you can override it"
    )
    .option(
        "-n, --name  [value]",
        "name of a patriarch to find. Required for csv. this skips the detection step and just reports that patriarch"
    )
    .option(
        "-a, --allow-female-concurrent-marriages",
        'set to true to allow women to also have concurrent marriages (ex, "sealed to one" and living with another'
    )
    .option("-d, --debug", "print the chart output to the console instead")
    .parse(process.argv)

const options = program.opts<CommandOpts>()

splash()

const [file] = program.args
const fileContents = parseFile(file)
const fileFormat = determineFormat(options.fileFormat, file)

const timelines = getTimelinesForMermaid({
    fileContents,
    fileFormat,
    allowFemaleConcurrentMarriages: options.allowFemaleConcurrentMarriages,
    patriarchName: options.name,
})

for (const patriarch in timelines) {
    if (!options.debug) {
        const filename = `${patriarch}.md`
        saveToFile(timelines[patriarch], filename, getFactoids())
    } else {
        stdout(timelines[patriarch])
    }
}
