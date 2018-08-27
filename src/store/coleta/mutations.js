export function setPesquisaAtual(state, pesquisa) {
  state.pesquisaAtual = pesquisa
}

export function setColetas(state, coletas) {
  state.coletas = coletas
}

export function setConcorrenteAtual(state, concorrente) {
  state.concorrenteAtual = concorrente
}

export function setColetaAtual(state, coleta) {
  state.coletaAtual = coleta
}

export function atualizaProdutoColeta(state, {coleta, produto}) {
  const coletaAtual = state.coletas.find(c => c.concorrente.id === coleta.concorrente.id)
  const produtoAtual = coletaAtual.produtos.find(p => p.id === produto.id)
  if (produtoAtual) {
    Object.assign(produtoAtual, { ...produto })
  }
}

export function encerraColeta(state, coleta) {
  const coletaAtual = state.coletas.find(c => c.concorrente.id === coleta.concorrente.id)
  coletaAtual.isEncerrada = true
}

export function setStatusColetasEnviada(state, status) {
  state.coletasEnviadas = status
}
