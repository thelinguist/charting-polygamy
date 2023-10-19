export enum LifeEventEnum {
    Birth = "Birth",
    Death = "Death",
    Marriage = "Marriage",
    Divorce = "Divorce",
}

export interface LifeEventRecord {
    date?: Date
    note?: string
}

export interface RelationshipEvent extends LifeEventRecord {
    person: string
}
export interface FactRecord {
    Name: string
    Event: LifeEventEnum
    /**
     * in format YYYY-MM-DD
     */
    Date?: string
    "Second Party"?: string
    Note?: string
}

export type KnowledgeTree = Record<string, PersonDetails>

export interface PersonDetails {
    name: string
    birth?: LifeEventRecord
    death?: LifeEventRecord
    marriages: Record<string, RelationshipEvent>
    divorces: Record<string, RelationshipEvent>
}

export interface MarriageDetails {
    start: Date
    end: Date
    spouse: string
}
