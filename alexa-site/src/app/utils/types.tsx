type FaqType = {
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
    faq: FaqType[],
}

type AddressType = {
    cep: string,
    bairro: string,
    rua: string,
    cidade: string,
    estado: string,
    numero: string,
    complemento: string,
    referencia: string
}

type CartHistoryType = {
    id: string,
    nome: string,
    image: string,
    preço: number
}

type ValueType = {
    soma: number,
    frete: number,
    total: number
}

type OrderType = {
    carrinho: CartHistoryType[],
    data: string,
    status: string,
    valor: ValueType,
    endereco: AddressType
}

export type UserType = {
    id: string,
    senha: string,
    nome: string,
    email: string,
    cpf: string,
    tel: string,
    endereco: AddressType[],
    carrinho: string[],
    pedidos: OrderType[],
    admin: boolean 
}