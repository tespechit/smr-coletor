import axios from 'axios'
import errorHandler from '../../support/errorHandler'
import config from '../../common/config'

const server = axios.create({
  baseURL: config.API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

const api = {
  getConcorrentes (idLoja) {
    return server
      .get('/coletor/concorrentes', { params: { idLoja } })
      .then(res => res.data)
      .catch(errorHandler('api.getConcorrentes'))
  },

  getPesquisas (idLoja) {
    return server
      .get('/coletor/pesquisas', { params: { idLoja } })
      .then(res => res.data)
      .catch(errorHandler('api.getPesquisas'))
  },

  enviarColeta (idLoja, idPesquisa, coletas) {
    return server
      .post('/coletor/enviar', { idLoja, idPesquisa, coletas })
      .then(res => res.data)
      .catch(errorHandler('api.enviarColeta'))
  }
}

export default api
