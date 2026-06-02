export const yearsBetween = (earlier: Date, later: Date): number => {
    return Math.floor((later.getTime() - earlier.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}
