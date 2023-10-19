/**
 *
 * @param fileRef a file blob
 * @param onprogress called when the browser wants to update how long the update is taking, as a percent
 */
export const parseFile = async (
    fileRef: Blob,
    onprogress: (percent: number) => void,
): Promise<string> => {
    const reader = new FileReader()
    return await new Promise((resolve, reject) => {
        reader.onload = (e) => {
            if (!e.target?.result) {
                reject()
            } else {
                resolve(e.target.result as string)
            }
        }
        reader.readAsText(fileRef)
        reader.onerror = (e) => reject(e)
        reader.onprogress = (e) => onprogress(e?.loaded / e?.total)
    })
}
