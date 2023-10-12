import figlet from 'figlet'
export const splash = () => {
    console.log(figlet.textSync("Charting\nPolygamy", {
           font: 'banner3-D',
    }))
}
