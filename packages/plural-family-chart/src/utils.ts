/**
 * given a start and end date, return a list of the beginning of each decade between them
 * @param start
 * @param end
 */
export const listDecades = (start: Date, end: Date): Date[] => {
    const decades = []
    const currentYear = start.getFullYear()
    const endYear = end.getFullYear()
    for (let year = currentYear; year <= endYear; year += 1) {
        if (year % 10 === 0) {
            decades.push(new Date(`${year}-01-02`))
        }
    }
    return decades
}
