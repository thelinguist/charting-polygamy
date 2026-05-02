import Link from "next/link"

export function Footer() {
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
                        <Link href="/chart/faq" style={{ textDecoration: "none", color: "var(--ink-mute)" }}>
                            FAQ
                        </Link>
                    </div>
                </div>
                <div>
                    <div className="eyebrow" style={{ marginBottom: 12 }}>
                        Note
                    </div>
                    <p className="footnote" style={{ maxWidth: "32ch", marginBottom: 16 }}>
                        Data is processed in your browser. Nothing is uploaded to a server.
                    </p>
                    <div className="footnote" style={{ color: "var(--ink-mute)" }}>
                        <a
                            href="https://github.com/thelinguist/charting-polygamy"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "var(--ink-mute)", textDecoration: "none" }}
                        >
                            GitHub ↗
                        </a>
                        <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
                        <span>AGPL-3.0</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
