const lojas = [
  { id: '1', descricao: 'L1 - Jaboatão ' },
  { id: '3', descricao: 'L2 - Cordeiro' },
  { id: '4', descricao: 'L3 - Piedade' }
]

export default {
  lojaAtual: lojas[0],
  lojas,
  pesquisas: [],
  concorrentes: [],
  dataUltimaSincronizacao: null
}
