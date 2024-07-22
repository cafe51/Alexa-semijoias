//app/utils/types.tsx
import { WhereFilterOp } from 'firebase/firestore';

export type UseCheckoutStateType = {
    showFullOrderSummary: boolean;
    showLoginSection: boolean;
    editingAddressMode: boolean;
    selectedDeliveryOption: string | null;
    selectedPaymentOption: string | null;
    deliveryOption: DeliveryOptionType | null;
    address: AddressType;
};

export type ProductType = {
    categoria: string,
    descricao: string,
    desconto: number,
    id: string,
    exist: boolean,
    nome: string,
    image: string[],
    preco: number,
    estoque: number,
    lancamento: boolean,
}

export type DeliveryOptionType = {
    name: string;
    deliveryTime: number;
    price: number;
  }

export type FilterOption = { field: string, operator: WhereFilterOp, value: string | number | string[] | number[] } ;

export type ProductCartType = {
    //o que vem de ProductType exceto categoria, desconto, lancamento e descrição
    id: string,
    exist: boolean,
    nome: string,
    image: string,
    preco: number,
    estoque: number,

    //o que vem de CartInfoType
    productId: string,
    quantidade: number,
    userId: string,
}

export type AddressType = {
    bairro: string,
    cep: string,
    complemento: string,
    ddd: string,
    gia: string,
    ibge: string,
    localidade: string,
    logradouro: string,
    numero: string,
    siafi: string,
    uf: string,
    unidade: string,
    referencia: string,
}

export type CartInfoType = {
    // exist: boolean,
    // id: string,
    productId: string,
    quantidade: number,
    userId: string
}

export type CartHistoryType = {
    categoria: string,
    productId: string,
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
    status: string,
    valor: ValueType,
    userId: string,
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

    address?: AddressType | null
}

export type RegisterFormInputType = {
    password: string,
    nome: string,
    email: string,
    tel: string
}
