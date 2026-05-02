import "./globals.css"
import type { Metadata } from "next"
import { Cormorant_Garamond, Source_Serif_4, JetBrains_Mono } from "next/font/google"
import Link from "next/link"

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

function NavBar() {
    const links = [
        { label: "Home", href: "/" },
        { label: "Chart a Tree", href: "/chart/upload" },
        { label: "Gallery", href: "/gallery" },
        { label: "About", href: "/chart/about" },
    ]

    return (
        <nav className="nav">
            <Link href="/" className="nav-mark">
                <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--c-overlap)" }}>◆</span>
                <span>Charting Polygamy</span>
                <span className="nav-mark-glyph">A Family-Tree Study</span>
            </Link>
            <div className="nav-links">
                {links.map(l => (
                    <Link key={l.href} href={l.href}>
                        {l.label}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

function Footer() {
    return (
        <footer>
            <div className="footer-grid">
                <div>
                    <div className="eyebrow" style={{ marginBottom: 12 }}>
                        Charting Polygamy
                    </div>
                    <div
                        style={{
                            fontFamily: "var(--serif)",
                            fontSize: 22,
                            lineHeight: 1.3,
                            maxWidth: "34ch",
                            color: "var(--ink-mute)",
                        }}
                    >
                        A small research tool for visualizing plural-marriage households in family-history data.
                    </div>
                </div>
                <div>
                    <div className="eyebrow" style={{ marginBottom: 12 }}>
                        Sections
                    </div>
                    <div className="flex flex-col gap-8 footnote">
                        <Link href="/" style={{ textDecoration: "none", color: "var(--ink-mute)" }}>
                            Home
                        </Link>
                        <Link href="/chart/upload" style={{ textDecoration: "none", color: "var(--ink-mute)" }}>
                            Chart a Tree
                        </Link>
                        <Link href="/gallery" style={{ textDecoration: "none", color: "var(--ink-mute)" }}>
                            Gallery
                        </Link>
                        <Link href="/chart/about" style={{ textDecoration: "none", color: "var(--ink-mute)" }}>
                            About
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="eyebrow" style={{ marginBottom: 12 }}>
                        Note
                    </div>
                    <p className="footnote" style={{ maxWidth: "32ch" }}>
                        Data is processed in your browser. Nothing is uploaded to a server.
                    </p>
                </div>
            </div>
        </footer>
    )
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
