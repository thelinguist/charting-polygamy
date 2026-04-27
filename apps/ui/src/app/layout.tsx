import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import styles from "./page.module.css"
import Header from "../components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Charting Polygamy",
    description: "A tool that generates graphs for plural family ancestry",
    authors: [{ name: "Bryce Shelley" }],
    keywords: [
        "polygamy",
        "mormonism",
        "mormon",
        "genealogy",
        "lds church",
        "flds",
        "mermaid.js",
        "plural family",
        "plural families",
    ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main className={styles.main}>{children}</main>
                <footer className={styles.footer}>
                    <a href="https://github.com/thelinguist/charting-polygamy" style={{ width: 24 }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-brand-github w-6 h-6 text-neutral-800 dark:text-white"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                        </svg>
                    </a>
                </footer>
            </body>
        </html>
    )
}
