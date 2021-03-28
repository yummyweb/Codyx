import React from 'react'
import "./FileInput.css"
import { imageUpload } from './utils/imageUpload.js'

function FileInput() {
    return (
        <div class="image-upload-wrap">
            <input onChange={e => imageUpload(e)} class="file-upload-input" type='file' />
            <div class="drag-text">
                <h3>Drag and drop a file</h3>
            </div>
        </div>
    )
}

export default FileInput
