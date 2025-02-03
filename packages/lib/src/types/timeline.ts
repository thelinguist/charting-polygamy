export interface PatriarchTimeline {
    name: string
    birth: Date
    death: Date
    marriages: {
        age?: number
        gap?: number
        start?: Date
        end?: Date // if omitted, marriage ended at death. TODO does not include living marriage
    }[] // patriarch only
}
export interface OtherMarriage {
    start: Date
    end: Date
    spouse: string
}

export interface Timeline extends Omit<PatriarchTimeline, "marriages"> {
    /**
     * patriarch linked
     */
    linkedMarriage: {
        start: Date
        end?: Date // if omitted, marriage ended at 1st death. TODO does not include living marriage
    }
    otherMarriages: OtherMarriage[]
    age?: number
    gap?: number
}
