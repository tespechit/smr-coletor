// import api from '../services/api'

const findColetaAtual = state => {
  return state.coletas.find(coleta => {
    return coleta.concorrente.id === state.concorrenteAtual.id
  })
}

const state = {
  pesquisaAtual: null,
  concorrenteAtual: null,
  coletas: []
}

const getters = {
  emAndamento: state => {
    return state.pesquisaAtual !== null
  },
  encerrada: (state, getters) => {
    if (!state.coletas.length) {
      return false
    }

    return state.coletas.every(coleta => {
      return coleta.encerrada
    })
  },
  coletaAtual: state => findColetaAtual(state),
  produtoAtual: state => {
    const coletaAtual = findColetaAtual(state)
    return coletaAtual.produtos[coletaAtual.posicao - 1]
  },
  progressoConcorrentes: state => {
    const progresso = {}
    state.coletas.map(coleta => {
      const percentual = coleta.posicao / coleta.totalProdutos * 100
      progresso[coleta.concorrente.id] = percentual
    })
    return progresso
  }
}

const mutations = {
  setPesquisaAtual(state, pesquisa) {
    state.pesquisaAtual = pesquisa
  },
  setConcorrenteAtual(state, concorrente) {
    state.concorrenteAtual = concorrente
  },
  setColetas(state, coletas) {
    state.coletas = coletas
  },
  atualizarProduto(state, novoProduto) {
    const coletaAtual = findColetaAtual(state)
    const produto = coletaAtual.produtos.find(produto => produto.id === novoProduto.id)
    Object.assign(produto, { ...novoProduto })
  },
  atualizarPosicaoProduto(state, satanas) {
    const coletaAtual = findColetaAtual(state)
    coletaAtual.posicao += satanas
    coletaAtual.encerrada = coletaAtual.posicao === coletaAtual.totalProdutos
  }
}

const actions = {
  iniciar({ commit, state }, { pesquisa, concorrentes }) {
    const produtosPesquisa = pesquisa.produtos.sort((a, b) => a.ordem - b.ordem)

    const coletas = concorrentes.map(concorrente => {
      const produtos = JSON.parse(JSON.stringify(produtosPesquisa)).map(
        produto => {
          return {
            ...produto,
            precoConcorrente: 0,
            promocao: false,
            dataHoraColeta: null
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

    commit('setPesquisaAtual', pesquisa)
    commit('setColetas', coletas)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
