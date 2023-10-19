export interface Config {
    debugMode: boolean
}

let config: Config = {
    debugMode: false
}

export const getConfig = () => config

export const setConfig = (override: Partial<Config>) => {
    config = {
        ...config,
        ...override,
    }
}
