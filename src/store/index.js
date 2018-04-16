import Vue from 'vue'
import Vuex from 'vuex'

import {
  LocalStorage,
  date
} from 'quasar'
import api from '../services/api'

Vue.use(Vuex)

const state = {
  idLoja: '1',
  idPesquisaSugestao: null,
  dataUltimaSincronizacao: null,
  pesquisas: [],
  concorrentes: [],
  coleta: {
    idPesquisa: null,
    idConcorrenteAtual: null
  }
}

const getters = {
  pesquisaColeta: (state) => {
    return state.pesquisas.find(pesquisa =>
      pesquisa.id === state.coleta.idPesquisa)
  },

  concorrenteColeta: (state) => {
    return state.concorrentes.find(concorrente =>
      concorrente.id === state.coleta.idConcorrenteAtual)
  }
}

const mutations = {
  inicializarStore(state) {
    const store = LocalStorage.get.item('store')
    if (store) {
      this.replaceState(
        Object.assign(state, JSON.parse(store))
      )
    }
  },

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
  },

  setColetaPesquisa(state, idPesquisa) {
    state.coleta.idPesquisa = idPesquisa
  },

  setColetaConcorrenteAtual(state, idConcorrente) {
    state.coleta.idConcorrenteAtual = idConcorrente
  }
}

const actions = {
  alterarLoja({
    commit,
    state
  }, {
    idLoja
  }) {
    LocalStorage.set('idLoja', idLoja)
    commit('setIdLoja', idLoja)
  },

  sincronizarDadosLoja({
    commit,
    dispatch
  }) {
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
      commit('setDataUltimaAtualizacao', date.formatDate(Date.now(), 'DD/MM/YYYY HH:mm:ss'))
    })
  },

  async getPesquisas({
    commit,
    state
  }) {
    const pesquisas = await api.getPesquisas(state.idLoja)
    commit('setPesquisas', pesquisas)
  },

  async getIdPesquisaSugestao({
    commit,
    state
  }) {
    const idPesquisaSugestao = await api.getIdPesquisaSugestao(state.idLoja)
    commit('setIdPesquisaSugestao', idPesquisaSugestao)
  },

  async getConcorrentes({
    commit,
    state
  }) {
    const concorrentes = await api.getConcorrentes(state.idLoja)
    commit('setConcorrentes', concorrentes)
  },

  selecionaPesquisa({ commit }, idPesquisa) {
    commit('setColetaPesquisa', idPesquisa)
  },

  selecionaConcorrente({ commit }, idConcorrente) {
    commit('setColetaConcorrenteAtual', idConcorrente)
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

store.subscribe((mutation, state) => {
  LocalStorage.set('store', JSON.stringify(state))
})

export default store
