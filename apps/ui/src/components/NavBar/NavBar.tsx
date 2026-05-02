import Link from "next/link"

export function NavBar() {
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
