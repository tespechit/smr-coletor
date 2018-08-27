import * as db from '../../services/db'
import api from 'src/services/api'
import Store from '../index'

export function inicializaStore({ rootState }) {
  return db.recuperaState().then(store => {
    if (store) {
      Store.replaceState(Object.assign(rootState, store))
    }
  })
}

export function limpaStore() {
  db.limpar()
}

export function alteraLojaAtual({ commit }, loja) {
  commit('setLojaAtual', loja)
}

export function sincronizaDadosLoja({ commit, dispatch }) {
  return Promise.all([
    dispatch('getConcorrentes'),
    dispatch('getPesquisas')
  ]).then(() => {
    commit('setDataUltimaAtualizacao', Date.now())
  })
}

export function getPesquisas({ commit, state }) {
  return api.getPesquisas(state.lojaAtual.id).then(pesquisas => {
    commit('setPesquisas', pesquisas)
  })
}

export function getConcorrentes({ commit, state }) {
  return api.getConcorrentes(state.lojaAtual.id).then(concorrentes => {
    commit('setConcorrentes', concorrentes)
  })
}
