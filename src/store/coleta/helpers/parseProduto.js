import { parseFileToBase64 } from './parseFileToBase64'

const parsePrecoConcorrente = preco => {
  return Number(preco.replace('.', '').replace(',', '.'))
}

const parseProduto = async produto => {
  const precoConcorrente = parsePrecoConcorrente(produto.precoConcorrente)

  let foto = null
  if (produto.foto && produto.foto.length > 0) {
    foto = await parseFileToBase64(produto.foto, 'image/jpeg')
  }

  return {
    id: produto.id,
    precoConcorrente,
    foto,
    promocao: produto.promocao,
    dataHoraColeta: produto.dataHoraColeta
  }
}

export default parseProduto
