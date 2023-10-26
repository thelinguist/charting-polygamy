import * as fs from "fs"

const ONE_DAY = 24 * 60 * 60 * 1000
const ENCODING = "utf-8"
const existsInCache = async (cachePath: fs.PathLike) => {
    try {
        const stat = await fs.promises.stat(cachePath)
        const aDayAgo = new Date().getTime() - ONE_DAY
        return stat && stat.ctimeMs > aDayAgo
    } catch (e) {
        return false
    }
}

/**
 *
 * @param url
 * @param slug string
 * @param options
 */
export const fetchHTMLWithCache = async (url: string, slug: string, options?: {}): Promise<string> => {
    const cachePath = `caches/${slug}.html`
    if (!(await existsInCache(cachePath))) {
        console.log("does not exist in cache")
        const res = await fetch(url, options)
        if (!res.ok) {
            throw new Error(`failed to read ${url} with status ` + res.status + ": " + res.statusText)
        } else {
            const rawHtml = await res.text()
            await fs.promises.mkdir("caches", { recursive: true })
            await fs.promises.writeFile(cachePath, rawHtml, {
                encoding: ENCODING,
            })
            return rawHtml
        }
    }
    const fileBuffer = await fs.promises.readFile(cachePath)
    return fileBuffer.toString(ENCODING)
}
