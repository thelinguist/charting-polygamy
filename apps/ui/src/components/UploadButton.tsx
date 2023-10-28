import React from "react"

export const UploadButton = ({ text, title, onChange }) => {
    return (
        <button>
            <label htmlFor="upload" role="button" title={title}>
                <a>
                    {text}
                </a>
            </label>
            <input id="upload" type="file" onChange={onChange} hidden />
        </button>
    )
}
