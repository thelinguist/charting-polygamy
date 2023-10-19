import fs from "fs"

function getFacts(factoids) {
    return `
## Notes
${Object.keys(factoids)
    .map(
        (name) => `### ${name}
${factoids[name]
    .map(
        (fact) => `
- ${fact}`,
    )
    .join("")}
`,
    )
    .join("")}`
}

const outFolder = "output"
export const saveToFile = (mermaidCode, fileName, factoids) => {
    if (!fs.existsSync(outFolder)) {
        fs.mkdirSync(outFolder)
    }
    fs.writeFileSync(
        `${outFolder}/${fileName}`,
        `
\`\`\`mermaid
    ${mermaidCode}
\`\`\`

${getFacts(factoids)}
`,
    )
}
