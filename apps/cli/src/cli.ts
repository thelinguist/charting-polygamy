#!/usr/bin/env ts-node

import {Command} from 'commander'
import packageJson from '../package.json'
import {splash} from './splash'
import {runProgram} from 'lib'


const program = new Command()
program
    .version(packageJson.version)
    .description("A tool for analyzing polygamy in genealogy files")
    .argument('<inputFile>', 'the input file (csv or gedcom)')
    .option("-f, --file-format  [value]", "file format. valid options are 'csv' and 'ged'. The program automatically detects format, but you can override it")
    .option("-n, --name  [value]", "name of a patriarch to find. Required for csv. this skips the detection step and just reports that patriarch")
    .option("-d, --debug", "print the chart output to the console instead")
    .parse(process.argv)

const options = program.opts()

splash()

runProgram(program.args[0], options.factsFile, options.name, options.debug)
