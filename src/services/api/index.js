const api = {
  getPesquisas(idLoja) {
    const idPesquisaSugestao = 3
    const pesquisas = [
      { id: 1, nome: 'Pesquisa #1' },
      { id: 2, nome: 'Pesquisa #2' },
      { id: 3, nome: 'Pesquisa #3' },
      { id: 4, nome: 'Pesquisa #4' },
      { id: 5, nome: 'Pesquisa #5' },
      { id: 6, nome: 'Pesquisa #6' },
      { id: 7, nome: 'Pesquisa #7' }
    ]

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ idPesquisaSugestao, pesquisas }), 250)
    })
  },

  getDadosColeta(idLoja, idPesquisa) {
    const dadosColeta = [
      {
        id: 123123,
        descricao: 'Descrição Item Tipo 100g Sabor',
        precoVenda: 1.23
      },
      {
        id: 321321,
        descricao: 'Descrição Item Tipo 200g Sabor',
        precoVenda: 3.21
      },
      {
        id: 213213,
        descricao: 'Descrição Item Tipo 300g Sabor',
        precoVenda: 2.13
      }
    ]

    return Promise.resolve(dadosColeta)
  },

  enviaColeta(idLoja, resultadoColeta) {
    return true
  }
}

export default api
