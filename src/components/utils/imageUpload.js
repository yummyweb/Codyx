import { getBase64 } from './getBase64.js'

export const imageUpload = async e => {
    const file = e.target.files[0];
    return await getBase64(file)
}