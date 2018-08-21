import { findColetaAtual } from './helpers/findColetaAtual'

export function emAndamento(state) {
  return state.pesquisaAtual !== null
}

export function encerrada(state, getters) {
  if (!state.coletas.length) {
    return false
  }

  return state.coletas.every(coleta => {
    return coleta.encerrada
  })
}

export function coletaAtual(state) {
  return findColetaAtual(state)
}

export function produtoAtual(state) {
  const coletaAtual = findColetaAtual(state)
  return coletaAtual.produtos[coletaAtual.posicao - 1]
}

export function progressoConcorrentes(state) {
  const progresso = {}
  state.coletas.map(coleta => {
    const percentual = (coleta.posicao / coleta.totalProdutos) * 100
    progresso[coleta.concorrente.id] = percentual
  })
  return progresso
}
