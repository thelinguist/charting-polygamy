import mermaid from 'mermaid'


  // Example of using the render function
export const drawDiagram = async function (element: HTMLDivElement, graphDefinition: string) {
  const { svg } = await mermaid.render('graphDiv', graphDefinition)
  element.innerHTML = svg!
}



mermaid.initialize({ startOnLoad: true })
