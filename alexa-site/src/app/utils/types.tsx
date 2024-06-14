import { WhereFilterOp } from 'firebase/firestore';

export type ProductType = {
    exist: boolean,
    id: string,
    nome: string,
    descricao: string,
    image: string[],
    preco: number,
    estoque: number,
    desconto: number,
    lancamento: boolean,
    categoria: string,
    // medidas: string,
    // banho: string,
    // stoneColor: string,
    // stoneType: string,
    // faq: FaqType[],
}

export type FilterOption = { field: string, operator: WhereFilterOp, value: string | number | string[] | number[] } ;

export type ProductCartType = {
    id: string,
    exist: boolean,
    productId: string,
    nome: string,
    image: string,
    preco: number,
    quantidade: number,
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

export type CartInfoType = {
    // exist: boolean,
    // id: string,
    productId: string,
    quantidade: number,
    userId: string
}

export type CartHistoryType = {
    id: string,
    nome: string,
    image: string,
    preco: number
}

type ValueType = {
    soma: number,
    frete: number,
    total: number
}

export type OrderType = {
    cartSnapShot: CartHistoryType[],
    data: string,
    status: string,
    valor: ValueType,
    endereco: AddressType
}

export type UserType = {
    id: string,
    nome: string,
    email: string,

    cpf: string,
    tel: string,
    admin: boolean,
    
    userId: string,
}

export type RegisterFormInputType = {
    password: string,
    nome: string,
    email: string,
    tel: string
}
