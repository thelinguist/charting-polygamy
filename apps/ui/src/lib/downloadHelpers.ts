const createDownloadLink = (url: string, ext: string, filename: string) => {
    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = `${filename}.${ext}`
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
}

const createInMemoryPNG = async (svgData: string, scale = 10): Promise<string> => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    const img = document.createElement("img")
    img.setAttribute("src", "data:image/svg+xml;base64," + btoa(svgData))
    await new Promise(resolve => (img.onload = resolve))
    canvas.width = img.width * scale
    canvas.height = img.height * scale
    ctx?.drawImage(img, 0, 0)

    return canvas.toDataURL("image/png")
}

const createInMemorySVG = (svgData: string): string => {
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    return URL.createObjectURL(svgBlob)
}

interface DownloadOptions {
    asPNG?: boolean
    fileName?: string
    transparent?: boolean
}

export const downloadSVGFromDOM = async (
    id: string,
    options: DownloadOptions
) => {
    const svg = document.querySelector(`#${id} svg`)
    if (svg) {
        const svgStyles = svg.getAttribute("style")
        if (!options.transparent) {
            svg.setAttribute("style", "background-color: #fff")
        }

        const svgData = new XMLSerializer().serializeToString(svg)
        if (options.asPNG) {
            const pngUrl = await createInMemoryPNG(svgData)
            createDownloadLink(pngUrl, "png", options.fileName ?? id)
        } else {
            const svgUrl = createInMemorySVG(svgData)
            createDownloadLink(svgUrl, "svg", options.fileName ?? id)
        }
        if (!options.transparent) {
            svg.setAttribute("style", svgStyles!)
        }
    }
}
