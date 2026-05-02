export interface GalleryPolygamist {
    /**
     * one short sentence (clause form) as to why this person is in the list.
     */
    notability?: string
    /**
     * a short summary of the patriarch and optionally the plural family
     */
    note?: string
    name: string
    /**
     * year
     */
    born?: number
    /**
     * year
     */
    died?: number
    /**
     * zip compressed chartData object
     */
    data?: string
    /**
     * the source of the data, hyperlinkable when possible
     */
    source?: string | { href: string; text: string }
    /**
     * can be an estimate as a string
     */
    wifeCount?: number | string
}
