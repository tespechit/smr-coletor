import Vue from 'vue'
import Vuex from 'vuex'

import { LocalStorage } from 'quasar'
import api from '../services/api'

Vue.use(Vuex)

const state = {
  idLoja: null
}

const getters = {}

const mutations = {
  carregarState(state, novoState) {
    state.idLoja = novoState.idLoja
  },

  setLoja(state, idLoja) {
    state.idLoja = idLoja
  }
}

const actions = {
  carregarState({ commit }) {
    const idLoja = LocalStorage.get.item('idLoja') || '1'
    const state = {
      idLoja
    }
    commit('carregarState', state)
  },

  alterarLoja({ commit, state }, { idLoja }) {
    LocalStorage.set('idLoja', idLoja)
    commit('setLoja', idLoja)
  },

  carregarPesquisas({ commit, state }) {
    return api.getPesquisas(state.idLoja)
  }
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

export default store
