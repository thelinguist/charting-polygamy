import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), dts()],
    build: {
        lib: {
            entry: "src/index.ts",
            name: "PluralFamilyChart",
            formats: ["es", "cjs", "umd"],
        },
    },
})
