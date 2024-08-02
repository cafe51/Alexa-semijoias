//app/utils/types.tsx
import { WhereFilterOp } from 'firebase/firestore';

export type UseNewProductStateType = {
    name: string;
    description: string;
    value: {
        price: number,
        promotionalPrice: number,
        cost: number,
    }
    stockQuantity: number | undefined,
    variations: string[] | never[],
    sku: string,
    barcode: string,
    dimensions: { length: number, width: number, height: number, weight: number },
    productVariations: any;
};


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
    //o que vem de ProductType exceto desconto, lancamento e descrição
    id: string,
    categoria: string,
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
    id: string;
    categoria: string,
    productId: string,
    quantidade: number,
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

    data: string;
    totalQuantity: number,
    paymentOption: string,
    deliveryOption: string,
}

export type UserType = {
    nome: string,
    email: string,
    userId: string,
    cpf: string,
    tel: string,
    admin: boolean,
    
    address?: AddressType | null
}

export type RegisterFormInputType = {
    password: string,
    nome: string,
    email: string,
    tel: string
}
