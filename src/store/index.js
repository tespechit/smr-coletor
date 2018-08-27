import Vue from 'vue'
import Vuex from 'vuex'
import { debounce } from 'quasar'
import * as db from '../services/db'

import coleta from './coleta'
import global from './global'

Vue.use(Vuex)

const Store = new Vuex.Store({
  state: global.state,
  getters: global.getters,
  mutations: global.mutations,
  actions: global.actions,
  modules: {
    coleta
  }
})

const persisteState = debounce(state => {
  db.persisteState(state)
}, 3000)

Store.subscribe((_, state) => {
  persisteState(state)
})

export default Store
