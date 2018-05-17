import { date } from 'quasar'
import api from 'src/services/api'

const state = {
  idLoja: '1',
  lojas: [
    { label: 'L1 - Jaboatão ', value: '1' },
    { label: 'L2 - Cordeiro', value: '3' },
    { label: 'L3 - Piedade', value: '4' }
  ],
  pesquisas: [],
  concorrentes: [],
  dataUltimaSincronizacao: null
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
    return Promise.all([
      dispatch('getConcorrentes'),
      dispatch('getPesquisas')
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
