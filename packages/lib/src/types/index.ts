import { FactRecord } from "./facts"

export * from "./timeline"
export * from "./facts"
export * from "./gedcom"
export * from "./statistics"

/**
 * a family composed of a man, all his wives, and all their children
 * facts include all these people, their births, deaths, marriages, and divorces
 */
export interface PatriarchalFamily {
    facts: FactRecord[]
    patriarchName: string
}

export enum FileTypes {
    ged = "ged",
    csv = "csv",
}
