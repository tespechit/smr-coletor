import axios from 'axios'

export function parseFileToBase64(filePath, mime) {
  return axios.get(filePath, { responseType: 'arraybuffer' }).then(response => {
    return (
      `data:${mime};base64,` +
      Buffer.from(response.data, 'binary').toString('base64')
    )
  })
}
