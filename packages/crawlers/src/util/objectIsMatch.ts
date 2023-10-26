export const objectIsMatch = (obj1, obj2) => {
    for (const key in obj1) {
        if (obj1[key] === "" && obj2[key] === undefined) continue
        if (obj2[key] === "" && obj1[key] === undefined) continue
        if (obj1[key] !== obj2[key]) return false
    }
    return true
}
