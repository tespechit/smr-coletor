const api = {
  getPesquisas(idLoja) {
    const pesquisas = [
      { id: 1, nome: 'Pesquisa #1', itens: [] },
      { id: 2, nome: 'Pesquisa #2', itens: [] },
      { id: 3, nome: 'Pesquisa #3', itens: [] },
      { id: 4, nome: 'Pesquisa #4', itens: [] },
      { id: 5, nome: 'Pesquisa #5', itens: [] },
      { id: 6, nome: 'Pesquisa #6', itens: [] },
      { id: 7, nome: 'Pesquisa #7', itens: [] }
    ]

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(pesquisas), 250)
    })
  },

  getIdPesquisaSugestao(idLoja) {
    const idPesquisaSugestao = 3
    return Promise.resolve(idPesquisaSugestao)
  },

  getConcorrentes(idLoja) {
    const concorrentes = [
      { id: 1, nome: 'Bom Preço', ordem: 3 },
      { id: 2, nome: 'Da Casa', ordem: 2 },
      { id: 3, nome: 'Boas Compras', ordem: 1 },
      { id: 4, nome: 'Nordeste', ordem: 4 }
    ]

    return Promise.resolve(concorrentes)
  },

  enviaColeta(idLoja, resultadoColeta) {
    return true
  }
}

export default api
