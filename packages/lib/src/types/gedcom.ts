export interface GedcomTree {
    type: "root"
    children: GedcomEntity[]
}

export type FamilyRecord = GedcomEntity & {
    type: GedcomType.Family
    data: {
        formal_name: "FAMILY"
        value: undefined
        xref_id: string
    }
}

export type GedcomSource = GedcomRecord & {
    type: GedcomType.Source
    data: {
        formal_name: "Source"
        pointer: string
    }
    children: [
        {
            type: "_APID"
            data: {
                custom_tag: true
            }
            value: string
            children: any
        },
    ]
}

export type SexIdentityRecord = GedcomRecord & {
    type: GedcomType.Sex
    data: {
        formal_name: "SEX"
    }
    value: "M" | "F"
    children: GedcomSource
}

export type GedcomFamilyRelationFact = GedcomRecord & {
    data: {
        formal_name: "FAMILY_SPOUSE"
        pointer: string
    }
}

export type GedcomIndividual = GedcomEntity & {
    type: GedcomType.Individual
    data: {
        formal_name: "INDIVIDUAL"
        xref_id: string
    }
    children: (GedcomRecord | GedcomFamilyRelationFact)[]
}

// https://gedcom.io/specifications/ged551.pdf page 83
export enum GedcomType {
    Family = "FAM",
    Husband = "HUSB",
    Wife = "WIFE",
    Child = "CHIL",
    Marriage = "MARR",
    MarriageLicense = "MARL", // An event of obtaining a legal license to marry.
    Engagement = "ENGA",
    Source = "SOUR",
    Individual = "INDI",
    FamilySpouseRelation = "FAMS",
    Sex = "SEX",
    Name = "NAME",
    Birth = "BIRT",
    Death = "DEAT",
    Date = "DATE",
    Place = "PLAC",
    Head = "HEAD",
    Trailer = "TRLR",
    Divorce = "DIV",
}

export interface GedcomRecord {
    type: GedcomType
    data: {
        formal_name: string
        value?: any
        pointer?: string
    }
    value?: any
    children: GedcomRecord[]
}

export interface GedcomEntity extends GedcomRecord {
    data: {
        formal_name: string
        value: undefined
        xref_id?: string
    }
}
