export function isColetaEmAndamento(state) {
  return state.coletaAtual !== null
}

export function isColetasEncerradas(state) {
  return state.coletas.every(coleta => {
    return coleta.isEncerrada
  })
}

export function progressoConcorrentes(state) {
  const progresso = {}
  state.coletas.map(coleta => {
    let posicao = coleta.produtos.findIndex(
      produto => produto.dataHoraColeta === null
    )

    if (posicao < 0) {
      posicao = coleta.totalProdutos
    }

    const percentual = (posicao / coleta.totalProdutos) * 100
    progresso[coleta.concorrente.id] = percentual
  })
  return progresso
}
