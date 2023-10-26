import { evenlySpace } from "../wikiTree/cleaners"

export const cleanName = (name: string, adoptedName?: string) => {
    if (adoptedName) {
        const regex = new RegExp(`(\\w+\\s+)+\\(\\w+\\)\\s+${adoptedName}`, "i")
        const groups = regex.test(name)
        if (groups) {
            return evenlySpace(name.replace(adoptedName, "").replace(/[()]/g, ""))
        }
    }
    return evenlySpace(name)
}
