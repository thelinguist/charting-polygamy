export interface Config {
    debugMode: boolean
    allowFemaleConcurrentMarriages: boolean
}

let config: Config = {
    debugMode: false,
    allowFemaleConcurrentMarriages: false,
}

export const getConfig = () => config

export const setConfig = (override: Partial<Config>) => {
    config = {
        ...config,
        ...override,
    }
}
