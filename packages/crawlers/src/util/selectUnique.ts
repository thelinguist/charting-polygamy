import { objectIsMatch } from "./objectIsMatch"

export const selectUnique = (oldList, newList) => newList.filter((fact) => !oldList.find((factToCheck) => objectIsMatch(factToCheck, fact)))
