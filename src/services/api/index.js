import axios from 'axios'

const server = axios.create({
  baseURL: 'http://192.168.0.221:8080/api/',
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

const errorHandler = (error) => {
  let errorMessage = ''

  if (error.response) {
    errorMessage = error.response.data.error
  } else if (error.request) {
    errorMessage = JSON.stringify(error.request, null, '\t')
  } else {
    errorMessage = error.message
  }

  console.error(error)

  return Promise.reject(errorMessage)
}

const api = {
  getConcorrentes(idLoja) {
    return server
      .get('/coletor/concorrentes', { params: { idLoja } })
      .then(res => res.data)
      .catch(errorHandler)
  },

  getPesquisas(idLoja) {
    return server
      .get('/coletor/pesquisas', { params: { idLoja } })
      .then(res => res.data)
      .catch(errorHandler)
  },

  enviarColeta(idLoja, idPesquisa, coletas) {
    return server
      .post('/coletor/enviar', { idLoja, idPesquisa, coletas })
      .then(res => res.data)
      .catch(errorHandler)
  }
}

export default api
