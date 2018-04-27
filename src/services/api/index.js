import axios from 'axios'

const server = axios.create({
  baseURL: 'http://192.168.0.221:8080/api/',
  timeout: 10000
})

const api = {
  getConcorrentes(idLoja) {
    return server
      .get('/coletor/concorrentes', { params: { idLoja } })
      .then(res => res.data)
  },

  getPesquisas(idLoja) {
    return server
      .get('/coletor/pesquisas', { params: { idLoja } })
      .then(res => res.data)
  },

  enviarColeta(idLoja, idPesquisa, coletas) {
    return server
      .post('/coletor/enviar', { idLoja, idPesquisa, coletas })
      .then(res => res.data)
      .catch(error => Promise.reject(error.response.data))
  }
}

export default api
