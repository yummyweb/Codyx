import React, { useState } from 'react'
import "./FileInput.css"
import { imageUpload } from './utils/imageUpload.js'

function FileInput({ setFile }) {
    const [filename, setFilename] = useState(null)
    return (
        <div class="image-upload-wrap">
            <input onChange={e => {
                imageUpload(e).then(res => setFile(res))
                const file = e.target.files[0]
                setFilename(file.name)
            }} class="file-upload-input" type='file' />
            <div class="drag-text">
                {!filename ? <h3>Drag and drop a file</h3> : <h3>Uploaded: { filename }</h3> }
            </div>
        </div>
    )
}

export default FileInput
