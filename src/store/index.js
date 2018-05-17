import Vue from 'vue'
import Vuex from 'vuex'
import { LocalStorage, throttle } from 'quasar'

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
    },
    limparStorage() {
      LocalStorage.clear()
    }
  },
  modules: {
    global,
    coleta
  }
})

store.subscribe((mutation, state) => {
  throttle(function() {
    LocalStorage.set('store', JSON.stringify(state))
  }, 500)
})

export default store
