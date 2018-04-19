import Vue from 'vue'
import Vuex from 'vuex'
import { LocalStorage } from 'quasar'

import global from './modules/global'
import coleta from './modules/coleta'

Vue.use(Vuex)

const store = new Vuex.Store({
  mutations: {
    inicializarStore(state) {
      const store = LocalStorage.get.item('store')
      if (store) {
        this.replaceState(Object.assign(state, JSON.parse(store)))
      }
    }
  },
  modules: {
    global,
    coleta
  }
})

store.subscribe((mutation, state) => {
  LocalStorage.set('store', JSON.stringify(state))
})

export default store
