export function lojaAtual(state) {
  return state.lojas.find(l => l.id === state.idLojaAtual)
}

export function pesquisas(state) {
  return state.pesquisas.map(pesquisa => ({
    id: pesquisa.id,
    nome: pesquisa.nome,
    sugestao: pesquisa.sugestao
  }))
}

export function concorrentes(state) {
  return state.concorrentes
}

export function pesquisaAtual(state) {
  return state.pesquisas.find(p => p.id === state.idPesquisaAtual)
}

export function isPesquisaSelecionada(state) {
  return !!state.idPesquisaAtual
}

export function concorrenteAtual(state) {
  return state.concorrentes.find(c => c.id === state.idConcorrenteAtual)
}

export function coletaAtual(state) {
  return state.coletas[state.indexColetaAtual]
}

export function isColetasEncerradas(state) {
  return state.coletas.every(coleta => coleta.isEncerrada)
}

export function isColetasEnviadas(state) {
  return state.isColetasEnviadas
}

export function progressoConcorrentes(state) {
  return state.coletas.map(coleta => {
    let index = coleta.produtos.findIndex(p => p.dataHoraColeta === null)
    const percentual = index < 0 ? 100 : (index / coleta.totalProdutos) * 100
    return {
      id: coleta.concorrente.id,
      percentual
    }
  })
}
