import parseProduto from './parseProduto'

export function parseColetas(coletas) {
  return coletas.map(async coleta => {
    const promises = coleta.produtos.map(produto => {
      return parseProduto(produto)
    })

    const produtos = await Promise.all(promises)

    return {
      idConcorrente: coleta.concorrente.id,
      produtos
    }
  })
}
