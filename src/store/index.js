import Vue from 'vue'
import Vuex from 'vuex'
import { debounce } from 'quasar'
import localforage from 'localforage'

localforage.config({
  driver: localforage.WEBSQL,
  name: 'SMRColetor',
  version: 1.0,
  size: 10485760,
  storeName: 'smr_coletor'
})

import global from './modules/global'
import coleta from './modules/coleta'

Vue.use(Vuex)

const store = new Vuex.Store({
  actions: {
    inicializarStore(state) {
      return localforage
        .getItem('store')
        .then(store => {
          if (store) {
            this.replaceState(Object.assign(state, store))
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    limparStore() {
      localforage.clear()
    }
  },
  modules: {
    global,
    coleta
  }
})

const persistirState = debounce(function(state) {
  localforage
    .setItem('store', state)
    .catch(err => {
      console.error(err)
    })
}, 15 * 1000)

store.subscribe((mutation, state) => {
  persistirState(state)
})

export default store
