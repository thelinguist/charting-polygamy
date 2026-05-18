"use client"

import { useState } from "react"

const email = ["chartingpolygamy", "noctiluma.com"]

// intentionally using javascript to render this at load
export const GalleryContactInfo = () => {
    const [info] = useState(email.join("@"))
    return <a href={`mailto:${info}`}>{info}</a>
}
