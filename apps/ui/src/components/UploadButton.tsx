import React from "react"

export const UploadButton = ({ text, title, onChange, accept }) => {
    return (
        <button>
            <label htmlFor="upload" role="button" title={title}>
                <a>
                    {text}
                </a>
            </label>
            <input id="upload" type="file" accept={accept} onChange={onChange} hidden />
        </button>
    )
}
