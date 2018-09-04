import Vue from 'vue'
import Vuex from 'vuex'
import { debounce } from 'quasar'
import * as db from '../services/db'

import * as actions from './actions'
import * as mutations from './mutations'
import * as getters from './getters'
import state from './state'

Vue.use(Vuex)

const Store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
})

const persisteState = debounce(state => {
  db.persisteState(state)
}, 3000)

Store.subscribe((_, state) => {
  persisteState(state)
})

export default Store
