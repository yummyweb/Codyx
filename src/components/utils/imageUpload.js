import { getBase64 } from './getBase64.js'

export const imageUpload = e => {
    const file = e.target.files[0];
    getBase64(file).then(base64 => {
        localStorage["fileBase64"] = base64;
    });
}