import api from '../../services/api'

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
    const produto = coletaAtual.produtos.find(
      produto => produto.id === novoProduto.id
    )
    Object.assign(produto, { ...novoProduto })
  },
  atualizarPosicaoProduto(state, inc) {
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
}

const actions = {
  iniciar({ commit, state }, { pesquisa, concorrentes }) {
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

    commit('setPesquisaAtual', pesquisa)
    commit('setColetas', coletas)
  },
  avancarConcorrente({ state }, idConcorrente) {
    const coleta = state.coletas.find(
      coleta => coleta.concorrente.id === idConcorrente
    )
    coleta.encerrada = true
    coleta.posicao = coleta.totalProdutos

    coleta.produtos.forEach(produto => {
      produto.promocao = false
      produto.foto = null
      produto.precoConcorrente = 0.0
      produto.dataHoraColeta = Date.now()
    })
  },
  enviar({ state }, idLoja) {
    const coletas = state.coletas.map(coleta => {
      const produtos = coleta.produtos.map(produto => {
        const precoConcorrente = Number(
          produto.precoConcorrente.replace('.', '').replace(',', '.')
        )

        return {
          id: produto.id,
          precoConcorrente,
          foto: produto.foto,
          promocao: produto.promocao,
          dataHoraColeta: produto.dataHoraColeta
        }
      })

      return {
        idConcorrente: coleta.concorrente.id,
        produtos
      }
    })
    return api.enviarColeta(idLoja, state.pesquisaAtual.id, coletas)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
