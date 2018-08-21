import Vue from 'vue'

import { findColetaAtual } from './helpers/findColetaAtual'

export function setPesquisaAtual(state, pesquisa) {
  state.pesquisaAtual = pesquisa
}

export function setConcorrenteAtual(state, concorrente) {
  state.concorrenteAtual = concorrente
}

export function setColetas(state, coletas) {
  state.coletas = coletas
}

export function atualizarProduto(state, novoProduto) {
  const coletaAtual = findColetaAtual(state)

  const produto = coletaAtual.produtos.find(
    produto => produto.id === novoProduto.id
  )

  Object.assign(produto, { ...novoProduto })
}

export function atualizarPosicaoProduto(state, inc) {
  const coletaAtual = findColetaAtual(state)
  coletaAtual.posicao += inc

  if (coletaAtual.posicao > coletaAtual.totalProdutos) {
    coletaAtual.posicao = coletaAtual.totalProdutos
  }

  if (coletaAtual.posicao < 1) {
    coletaAtual.posicao = 1
  }

  coletaAtual.encerrada = coletaAtual.posicao === coletaAtual.totalProdutos
}

export function pularConcorrente(state, idConcorrente) {
  const coletaAtual = state.coletas.find(
    coleta => coleta.concorrente.id === idConcorrente
  )

  coletaAtual.produtos.forEach((produto, index) => {
    if (!produto.precoConcorrente) {
      Vue.set(coletaAtual.produtos, index, Object.assign(produto, {
        promocao: false,
        foto: null,
        precoConcorrente: '',
        dataHoraColeta: Date.now()
      }))
    }
  })

  coletaAtual.encerrada = true
  coletaAtual.posicao = coletaAtual.totalProdutos
}

export function resetarConcorrente(state, idConcorrente) {
  const coleta = state.coletas.find(
    coleta => coleta.concorrente.id === idConcorrente
  )
  coleta.posicao = 1
  coleta.encerrada = false
}

export function setStatusColetasEnviada(state, status) {
  state.coletasEnviadas = status
}
