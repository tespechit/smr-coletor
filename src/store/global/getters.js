export function pesquisas(state) {
  return state.pesquisas.map(pesquisa => {
    const produtos = pesquisa.produtos.map(produto => {
      return { ...produto }
    })
    return { ...pesquisa, produtos }
  })
}

export function concorrentes(state) {
  return state.concorrentes
    .map(concorrente => {
      return { ...concorrente }
    })
    .sort((a, b) => {
      return a.ordem - b.ordem
    })
}
