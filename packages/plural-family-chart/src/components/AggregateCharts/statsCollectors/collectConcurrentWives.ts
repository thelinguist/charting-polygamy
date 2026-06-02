import { CONCURRENT_AGE_MAX, CONCURRENT_AGE_MIN } from "../shared/chartConstants"
import type { PatriarchMarriage } from "./patriarchTypes"

export function collectConcurrentWives(
    birth: Date,
    death: Date,
    marriages: PatriarchMarriage[],
    concurrentByAge: Map<number, number[]>
): void {
    for (let age = CONCURRENT_AGE_MIN; age < CONCURRENT_AGE_MAX; age++) {
        const checkDate = new Date(birth.getFullYear() + age, birth.getMonth(), birth.getDate())
        if (checkDate > death) break

        let concurrent = 0
        for (const m of marriages) {
            if (!m.start) continue
            const end = m.end ?? death
            if (m.start <= checkDate && checkDate <= end) concurrent++
        }
        if (!concurrentByAge.has(age)) concurrentByAge.set(age, [])
        concurrentByAge.get(age)!.push(concurrent)
    }
}
