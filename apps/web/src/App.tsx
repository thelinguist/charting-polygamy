import './App.css'
import { Mermaid } from "./components/Mermaid.tsx"
import { example3Wives } from "./constants/sample.ts"

function App() {
  return (
    <>
      <h1>Charting Polygamy</h1>
      <div className={'chart'}>
        <Mermaid chart={example3Wives}/>
      </div>
    </>
  )
}

export default App
