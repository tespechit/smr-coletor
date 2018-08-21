const parseError = require('parse-error')

const errorHandler = message => err => {
  const errorData = parseError(err)
  console.error(message)
  console.error(JSON.stringify(errorData, null, '\t'))
  return Promise.reject(errorData)
}

export default errorHandler
