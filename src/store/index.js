import Vue from 'vue'
import Vuex from 'vuex'
import { debounce } from 'quasar'
import localforage from 'localforage'

import errorHandler from '../support/errorHandler'

import coleta from './coleta'
import global from './global'

const SEGUNDOS_ENTRE_PERSISTENCIA_STATE = 15

Vue.use(Vuex)

localforage.config({
  driver: localforage.WEBSQL,
  name: 'SMRColetor',
  size: 10485760,
  storeName: 'smrcoletor'
})

const persisteState = debounce(function(state) {
  localforage
    .setItem('store', state)
    .catch(errorHandler('localforage.setItem(store)'))
}, SEGUNDOS_ENTRE_PERSISTENCIA_STATE * 1000)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function(/* { ssrContext } */) {
  const Store = new Vuex.Store({
    actions: {
      inicializaStore(state) {
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
      limpaStore() {
        localforage.clear()
      }
    },
    modules: {
      coleta,
      global
    }
  })

  Store.subscribe((_, state) => {
    persisteState(state)
  })

  return Store
}
