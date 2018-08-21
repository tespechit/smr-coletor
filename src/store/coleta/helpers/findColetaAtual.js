export function findColetaAtual(state) {
  return state.coletas.find(coleta => {
    return coleta.concorrente.id === state.concorrenteAtual.id
  })
}
