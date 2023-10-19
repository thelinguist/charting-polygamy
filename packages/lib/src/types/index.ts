import { FactRecord } from "./facts"

export * from "./timeline"
export * from "./facts"
export * from "./gedcom"

export interface PatriarchalFamily {
    facts: FactRecord[]
    patriarchName: string
}

export enum FileTypes {
    ged = "ged",
    csv = "csv",
}
