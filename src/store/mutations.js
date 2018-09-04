export function setLojaAtual(state, idLoja) {
  state.idLojaAtual = idLoja
}

export function setPesquisas(state, pesquisas) {
  state.pesquisas = pesquisas
}

export function setConcorrentes(state, concorrentes) {
  state.concorrentes = concorrentes
}

export function setDataUltimaAtualizacao(state, data) {
  state.dataUltimaSincronizacao = data
}

export function setPesquisaAtual(state, idPesquisaAtual) {
  state.idPesquisaAtual = idPesquisaAtual
}

export function setColetas(state, coletas) {
  state.coletas = coletas
}

export function setConcorrenteAtual(state, idConcorrenteAtual) {
  state.idConcorrenteAtual = idConcorrenteAtual
}

export function setColetaAtual(state, indexColetaAtual) {
  state.indexColetaAtual = indexColetaAtual
}

export function atualizaProdutoColeta(state, { coleta, produto }) {
  const coletaTmp = state.coletas.find(
    c => c.concorrente.id === coleta.concorrente.id
  )
  const produtoTmp = coletaTmp.produtos.find(p => p.id === produto.id)
  if (produtoTmp) {
    Object.assign(produtoTmp, { ...produto })
  }
}

export function encerraColeta(state, coleta) {
  const coletaTmp = state.coletas.find(
    c => c.concorrente.id === coleta.concorrente.id
  )
  coletaTmp.isEncerrada = true
}

export function setStatusColetasEnviada(state, status) {
  state.isColetasEnviadas = status
}
