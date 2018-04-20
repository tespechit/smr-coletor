import { date } from 'quasar'
import api from '../../services/api'

const state = {
  idLoja: '1',
  idPesquisaSugestao: null,
  dataUltimaSincronizacao: null,
  pesquisas: [],
  concorrentes: []
}

const getters = {
  pesquisas: state => {
    return state.pesquisas.map(pesquisa => {
      const produtos = pesquisa.produtos.map(produto => {
        return { ...produto }
      })
      return { ...pesquisa, produtos }
    })
  },
  concorrentes: state => {
    return state.concorrentes
      .map(concorrente => {
        return { ...concorrente }
      })
      .sort((a, b) => {
        return a.ordem - b.ordem
      })
  }
}

const mutations = {
  setIdLoja(state, idLoja) {
    state.idLoja = idLoja
  },
  setPesquisas(state, pesquisas) {
    state.pesquisas = pesquisas
  },
  setIdPesquisaSugestao(state, idPesquisaSugestao) {
    state.idPesquisaSugestao = idPesquisaSugestao
  },
  setConcorrentes(state, concorrentes) {
    state.concorrentes = concorrentes
  },
  setDataUltimaAtualizacao(state, data) {
    state.dataUltimaSincronizacao = data
  }
}

const actions = {
  alterarLoja({ commit, state }, { idLoja }) {
    commit('setIdLoja', idLoja)
  },
  sincronizarDadosLoja({ commit, dispatch }) {
    commit('limparStorage', null, { root: true })

    return Promise.all([
      // new Promise((resolve, reject) => { setTimeout(() => { reject(new Error('Algo de errado não está certo')) }, 2000) }),
      dispatch('getPesquisas'),
      dispatch('getIdPesquisaSugestao'),
      dispatch('getConcorrentes'),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(true)
        }, 1000)
      })
    ]).then(() => {
      commit(
        'setDataUltimaAtualizacao',
        date.formatDate(Date.now(), 'DD/MM/YYYY HH:mm:ss')
      )
    })
  },
  getPesquisas({ commit, state }) {
    return api.getPesquisas(state.idLoja).then(pesquisas => {
      commit('setPesquisas', pesquisas)
    })
  },
  getIdPesquisaSugestao({ commit, state }) {
    return api.getIdPesquisaSugestao(state.idLoja).then(idPesquisaSugestao => {
      commit('setIdPesquisaSugestao', idPesquisaSugestao)
    })
  },
  getConcorrentes({ commit, state }) {
    return api.getConcorrentes(state.idLoja).then(concorrentes => {
      commit('setConcorrentes', concorrentes)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
