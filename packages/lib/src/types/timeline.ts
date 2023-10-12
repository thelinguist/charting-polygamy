export interface PatriarchTimeline {
    name: string
    birth: Date
    death: Date
    marriages: {
        age?: number
        gap?: number
        start?: Date
    }[] // patriarch only
}
export interface OtherMarriage {
    start: Date
    end: Date
    spouse: string
}

export interface Timeline extends Omit<PatriarchTimeline, 'marriages'> {
    /**
     * patriarch linked
     */
    linkedMarriage: {
        start: Date
        end?: Date
    }
    otherMarriages: OtherMarriage[]
    age?: number
    gap?: number
}
