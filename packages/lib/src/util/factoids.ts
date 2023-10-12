
const factoids = {}

export const addFactoid = (name, event, fact) => {
    if (!factoids[name]) factoids[name] = []
    factoids[name].push(`${event}: ${fact}`)
}

export const getFactoids = () => factoids
