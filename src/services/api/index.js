const api = {
  getPesquisas(idLoja) {
    const produtos = [
      { id: 112233, descricao: 'Descrição item A', precoVenda: 1.23, ordem: 1 },
      { id: 111222, descricao: 'Descrição item B', precoVenda: 1.22, ordem: 2 },
      { id: 223311, descricao: 'Descrição item C', precoVenda: 2.31, ordem: 3 },
      { id: 321321, descricao: 'Descrição item D', precoVenda: 3.21, ordem: 4 }
    ]

    const pesquisas = [
      { id: 1, nome: 'Pesquisa #1', produtos },
      { id: 2, nome: 'Pesquisa #2', produtos },
      { id: 3, nome: 'Pesquisa #3', produtos },
      { id: 4, nome: 'Pesquisa #4', produtos },
      { id: 5, nome: 'Pesquisa #5', produtos },
      { id: 6, nome: 'Pesquisa #6', produtos },
      { id: 7, nome: 'Pesquisa #7', produtos }
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
