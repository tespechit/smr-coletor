import { date } from 'quasar'
import api from 'src/services/api'

export function alteraLoja({ commit, state }, { idLoja }) {
  commit('setIdLoja', idLoja)
}

export function sincronizaDadosLoja({ commit, dispatch }) {
  return Promise.all([
    dispatch('getConcorrentes'),
    dispatch('getPesquisas')
  ]).then(() => {
    commit(
      'setDataUltimaAtualizacao',
      date.formatDate(Date.now(), 'DD/MM/YYYY HH:mm:ss')
    )
  })
}

export function getPesquisas({ commit, state }) {
  return api.getPesquisas(state.idLoja).then(pesquisas => {
    commit('setPesquisas', pesquisas)
  })
}

export function getConcorrentes({ commit, state }) {
  return api.getConcorrentes(state.idLoja).then(concorrentes => {
    commit('setConcorrentes', concorrentes)
  })
}
