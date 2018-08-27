import api from '../../services/api'
import { parseFileToBase64 } from './helpers/parseFileToBase64'

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

export function selecionaPesquisa({ commit, rootState }, idPesquisa) {
  const { concorrentes, pesquisas } = rootState
  const pesquisaAtual = pesquisas.find(pesquisa => pesquisa.id === idPesquisa)
  commit('setPesquisaAtual', pesquisaAtual)

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

export function selecionaConcorrente(
  { commit, state, rootState },
  idConcorrente
) {
  const concorrenteAtual = rootState.concorrentes.find(
    concorrente => concorrente.id === idConcorrente
  )
  commit('setConcorrenteAtual', concorrenteAtual)

  const coletaAtual = state.coletas.find(coleta => {
    return coleta.concorrente.id === concorrenteAtual.id
  })
  commit('setColetaAtual', coletaAtual)
}

export function encerraColetaAtual({ commit, state }) {
  commit('encerraColeta', state.coletaAtual)
}

export function ignorarConcorrente({ commit, state }, idConcorrente) {
  const coletaConcorrente = state.coletas.find(
    coleta => coleta.concorrente.id === idConcorrente
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

export async function enviaColeta({ commit, state, rootState }) {
  const promisesColetas = state.coletas.map(async coleta => {
    const promisesProdutos = coleta.produtos.map(async produto => {
      if (produto.foto) {
        produto.foto = await parseFileToBase64(produto.foto, 'image/jpeg')
      }
      const precoConcorrente = produto.precoConcorrente
        .replace('.', '')
        .replace(',', '.')
      return {
        id: produto.id,
        promocao: produto.promocao,
        precoConcorrente,
        dataHoraColeta: produto.dataHoraColeta,
        foto: produto.foto
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
    rootState.lojaAtual.id,
    state.pesquisaAtual.id,
    coletas
  )

  commit('setStatusColetasEnviada', true)

  return idColeta
}

export function atualizaProdutoAtual({ commit, state }, novoProduto) {
  novoProduto.dataHoraColeta = Date.now()
  commit('atualizaProdutoColeta', {
    coleta: state.coletaAtual,
    produto: { ...novoProduto }
  })
}
