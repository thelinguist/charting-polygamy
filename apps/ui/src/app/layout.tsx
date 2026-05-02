import "./globals.css"
import type { Metadata } from "next"
import { Cormorant_Garamond, JetBrains_Mono, Source_Serif_4 } from "next/font/google"
import { NavBar } from "../components/NavBar/NavBar"
import { Footer } from "../components/Footer/Footer"

const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-serif-display",
    display: "swap",
})

const sourceSerif = Source_Serif_4({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    style: ["normal", "italic"],
    variable: "--font-serif-text",
    display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-mono",
    display: "swap",
})

export const metadata: Metadata = {
    title: "Charting Polygamy",
    description:
        "A tool for charting plural-marriage households in family-tree data, set in the context of the Latter-day Saint movement of the nineteenth century.",
    authors: [{ name: "Bryce Shelley" }],
    keywords: [
        "polygamy",
        "mormonism",
        "mormon",
        "genealogy",
        "lds church",
        "plural family",
        "plural families",
        "family history",
    ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${cormorant.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}>
            <body>
                <NavBar />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    )
}
