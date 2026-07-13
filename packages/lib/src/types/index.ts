import { FactRecord } from "./facts"
import { ChildRecord } from "./timeline"

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
    childrenByWife?: Record<string, ChildRecord[]>
}

export enum FileTypes {
    ged = "ged",
    csv = "csv",
}
