import api from '../../services/api'

import { parseColetas } from './helpers/parseColetas'

export function iniciar({ commit, state }, { pesquisa, concorrentes }) {
  const produtosPesquisa = pesquisa.produtos.sort((a, b) => a.ordem - b.ordem)

  const coletas = concorrentes.map(concorrente => {
    const produtos = JSON.parse(JSON.stringify(produtosPesquisa)).map(
      produto => {
        return {
          ...produto,
          precoConcorrente: '',
          promocao: false,
          dataHoraColeta: null,
          foto: null
        }
      }
    )

    return {
      concorrente,
      produtos,
      totalProdutos: produtos.length,
      posicao: 1,
      encerrada: false
    }
  })

  commit('setConcorrenteAtual', concorrentes[0])
  commit('setPesquisaAtual', pesquisa)
  commit('setColetas', coletas)
  commit('setStatusColetasEnviada', false)
}

export function enviar({ commit, state }, idLoja) {
  return Promise.all(parseColetas(state.coletas))
    .then(coletas => {
      return api.enviarColeta(idLoja, state.pesquisaAtual.id, coletas)
    })
    .then(res => {
      commit('setStatusColetasEnviada', true)
      return res
    })
}
