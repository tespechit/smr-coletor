const lojas = [
  { id: 1, descricao: 'L1 - Jaboatão ' },
  { id: 3, descricao: 'L2 - Cordeiro' },
  { id: 4, descricao: 'L3 - Piedade' }
]

export default {
  dataUltimaSincronizacao: null,

  lojas,
  idLojaAtual: 1,

  pesquisas: [],
  idPesquisaAtual: null,

  concorrentes: [],
  idConcorrenteAtual: null,

  coletas: [],
  indexColetaAtual: null,
  isColetasEnviadas: false
}
