/**
 * for each item in the object that is true, include it in the class list
 * @param args
 */
const classNames = (...args: Array<string | boolean | Record<string, boolean>>) => {
    const names: string[] = []
    for (const arg of args) {
        if (typeof arg === "string") {
            names.push(arg as string)
        }
        if (typeof arg === "object") {
            for (const key in arg) {
                if (arg[key]) names.push(key)
            }
        }
    }
    return names.join(" ")
}

export default classNames
