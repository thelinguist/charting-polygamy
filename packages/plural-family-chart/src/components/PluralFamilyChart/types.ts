import { Timeline } from "lib/src/types"

/**
 * A timeline entry for a spouse where any or all of birth, death, and otherMarriages may be unknown.
 * Spouses with dates render a lifespan line; those without render only a marriage bar.
 */
export type PartialTimeline = Omit<Timeline, "birth" | "death" | "otherMarriages"> & {
    birth?: Date
    death?: Date
    otherMarriages?: Timeline["otherMarriages"]
}