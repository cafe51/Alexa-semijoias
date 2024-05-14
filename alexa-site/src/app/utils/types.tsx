type faqType = {
  pergunta: string,
  resposta: string
}

export type ProductType = {
  id: string,
  nome: string,
  descricao: string,
  image: string[],
  preco: number,
  estoque: number,
  desconto: number,
  lancamento: boolean,
  categoria: string[],
  medidas: string,
  banho: string,
  stoneColor: string,
  stoneType: string,
  faq: faqType[],
}

