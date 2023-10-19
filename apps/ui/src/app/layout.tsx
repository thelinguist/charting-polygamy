import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import styles from "./page.module.css"
import Header from "../components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Charting Polygamy",
    description: "intro",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                <main className={styles.main}>{children}</main>
            </body>
        </html>
    )
}
