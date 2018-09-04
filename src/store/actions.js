import * as db from 'src/services/db'
import api from 'src/services/api'
import Store from './index'
import { parseFileToBase64 } from './helpers/parseFileToBase64'

export function inicializaStore({ state }) {
  return db.recuperaState().then(store => {
    if (store) {
      Store.replaceState({ ...state, ...store })
    }
  })
}

export function limpaStore() {
  db.limpar()
}

export function alteraLojaAtual({ commit }, idLoja) {
  commit('setLojaAtual', idLoja)
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
  return api.getPesquisas(state.idLojaAtual).then(pesquisas => {
    commit('setPesquisas', pesquisas)
  })
}

export function getConcorrentes({ commit, state }) {
  return api.getConcorrentes(state.idLojaAtual).then(concorrentes => {
    commit('setConcorrentes', concorrentes)
  })
}

const parseProdutos = produtos => {
  const produtosClone = JSON.parse(JSON.stringify(produtos))
  return produtosClone.map(produto => {
    return {
      ...produto,
      precoConcorrente: '',
      promocao: false,
      dataHoraColeta: null,
      foto: null
    }
  })
}

export function selecionaPesquisa({ commit, state }, idPesquisa) {
  const { concorrentes, pesquisas } = state
  const pesquisaAtual = pesquisas.find(pesquisa => pesquisa.id === idPesquisa)
  commit('setPesquisaAtual', idPesquisa)

  const produtosPesquisa = pesquisaAtual.produtos.sort(
    (a, b) => a.ordem - b.ordem
  )
  const coletas = concorrentes.map(concorrente => {
    const produtos = parseProdutos(produtosPesquisa)
    return {
      concorrente,
      produtos,
      totalProdutos: produtos.length,
      isEncerrada: false
    }
  })
  commit('setColetas', coletas)

  commit('setStatusColetasEnviada', false)
}

export function selecionaConcorrente({ commit, state }, idConcorrente) {
  commit('setConcorrenteAtual', idConcorrente)

  const indexColeta = state.coletas.findIndex(
    c => c.concorrente.id === idConcorrente
  )
  commit('setColetaAtual', indexColeta)
}

export function encerraColetaAtual({ commit, getters }) {
  commit('encerraColeta', getters.coletaAtual)
}

export function ignorarConcorrente({ commit, state }, idConcorrente) {
  const coletaConcorrente = state.coletas.find(
    c => c.concorrente.id === idConcorrente
  )
  const produtosNaoColetados = coletaConcorrente.produtos.filter(
    produto => !produto.dataHoraColeta
  )

  produtosNaoColetados.map(produto => {
    produto.dataHoraColeta = Date.now()
    commit('atualizaProdutoColeta', {
      coleta: coletaConcorrente,
      produto
    })
  })

  commit('encerraColeta', coletaConcorrente)
}

export function atualizaProdutoAtual({ commit, getters }, novoProduto) {
  novoProduto.dataHoraColeta = Date.now()
  commit('atualizaProdutoColeta', {
    coleta: getters.coletaAtual,
    produto: { ...novoProduto }
  })
}

export async function enviaColeta({ commit, state }) {
  const promisesColetas = state.coletas.map(async coleta => {
    const promisesProdutos = coleta.produtos.map(async produto => {
      let foto

      try {
        foto = await parseFileToBase64(produto.foto, 'image/jpeg')
      } catch (e) {
        foto = false
      }

      const precoConcorrente = produto.precoConcorrente
        .replace('.', '')
        .replace(',', '.')
      return {
        id: produto.id,
        promocao: produto.promocao,
        precoConcorrente,
        dataHoraColeta: produto.dataHoraColeta,
        foto
      }
    })

    const produtos = await Promise.all(promisesProdutos)
    return {
      idConcorrente: coleta.concorrente.id,
      produtos
    }
  })

  const coletas = await Promise.all(promisesColetas)

  const { idColeta } = await api.enviarColeta(
    state.idLojaAtual,
    state.idPesquisaAtual,
    coletas
  )

  commit('setStatusColetasEnviada', true)

  return idColeta
}
