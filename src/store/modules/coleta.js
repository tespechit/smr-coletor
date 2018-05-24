import axios from 'axios'
import api from '../../services/api'

const findColetaAtual = state => {
  return state.coletas.find(coleta => {
    return coleta.concorrente.id === state.concorrenteAtual.id
  })
}

const converteFotoParaBase64 = (filePath) => {
  return axios.get(filePath, { responseType: 'arraybuffer' }).then(response => {
    return 'data:image/jpeg;base64,' + Buffer.from(response.data, 'binary').toString('base64')
  })
}

const parseColetas = coletas => {
  return coletas.map(async coleta => {
    const promises = coleta.produtos.map(produto => {
      return parseProduto(produto)
    })

    const produtos = await Promise.all(promises);

    return {
      idConcorrente: coleta.concorrente.id,
      produtos
    }
  })
}

const parseProduto = async (produto) => {
  const precoConcorrente = Number(
    produto.precoConcorrente.replace('.', '').replace(',', '.')
  )

  let foto = null;
  if (produto.foto && produto.foto.length > 0) {
    foto = await converteFotoParaBase64(produto.foto)
  }

  return {
    id: produto.id,
    precoConcorrente,
    foto,
    promocao: produto.promocao,
    dataHoraColeta: produto.dataHoraColeta
  }
}

const state = {
  pesquisaAtual: null,
  concorrenteAtual: null,
  coletasEnviadas: false,
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
  },
  pularConcorrente(state, idConcorrente) {
    const coletaAtual = state.coletas.find(
      coleta => coleta.concorrente.id === idConcorrente
    )

    const indexProdutoAtual = coletaAtual.produtos.findIndex(
      produto => produto.dataHoraColeta !== null
    )

    const posicaoAtual =
      indexProdutoAtual < 0 ? coletaAtual.totalProdutos : indexProdutoAtual + 1

    coletaAtual.produtos.slice(posicaoAtual).forEach(produto => {
      produto.promocao = false
      produto.foto = null
      produto.precoConcorrente = ''
      produto.dataHoraColeta = Date.now()
    })

    coletaAtual.encerrada = true
    coletaAtual.posicao = coletaAtual.totalProdutos
  },
  resetarConcorrente(state, idConcorrente) {
    const coleta = state.coletas.find(
      coleta => coleta.concorrente.id === idConcorrente
    )
    coleta.posicao = 1
    coleta.encerrada = false
  },
  setStatusColetasEnviada(state, status) {
    state.coletasEnviadas = status
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

    commit('setConcorrenteAtual', concorrentes[0])
    commit('setPesquisaAtual', pesquisa)
    commit('setColetas', coletas)
    commit('setStatusColetasEnviada', false)
  },
  enviar({ state }, idLoja) {
    return Promise.all(parseColetas(state.coletas)).then((coletas) => {
      return api.enviarColeta(idLoja, state.pesquisaAtual.id, coletas)
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
