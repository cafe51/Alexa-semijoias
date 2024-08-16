//app/utils/types.tsx
import { WhereFilterOp } from 'firebase/firestore';

export type CheckboxData = {
    label: string;
    isChecked: boolean;
  }

export type CategoryType = {
    categoryName: string;
}

export type VariationProductType = {
    customProperties: any,
    defaultProperties: { estoque: number, peso: number, imageIndex: number, dimensions: { largura: number, altura: number, comprimento: number }} 
}

export type ProductVariation = {
    barcode: string, 
    customProperties?: any,
    dimensions: { largura: number, altura: number, comprimento: number }
    estoque: number,
    name: string,
    peso: number,
    sku: string,
    value: { price: number, promotionalPrice: number, cost: number }
    productId: string;
    image: string;
}

export type ProductBundleType = {
    categories: string[],
    description: string;
    estoqueTotal: number,
    name: string;
    productVariations: ProductVariation[];

    sections: string[],
    subsections?: string[], // do tipo 'sectionName:subsectionName'[]
    value: { price: number, promotionalPrice: number, cost: number }
    variations?: string[],
    images: string[],

}

export type FullProductType = {
    name: string;
    description: string;
    categories: string[],
    categoriesFromFirebase: string[],
    value: {
        price: number,
        promotionalPrice: number,
        cost: number,
    }
    sections: string[],
    subsections?: string[] | null | undefined, // do tipo 'sectionName:subsectionName'[]
    variations: string[] | never[],
    productVariations: VariationProductType[] | never[];
    estoque?: number | undefined,
    sku?: string | undefined,
    barcode?: string | undefined,
    dimensions?: { largura: number, altura: number, comprimento: number, peso: number } | undefined,
    images: { file: File; localUrl: string; }[],

}

export type SectionType = {
    sectionName: string,
    subsections?: string[] | null | undefined,
}

export type StateNewProductType = FullProductType & { sectionsSite: SectionType[] | never[] };



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
    //o que vem de ProductVariation exceto desconto, lancamento e descrição
    // id: string,
    // exist: boolean,
    
    name: string,
    image: string,

    value: { price: number, promotionalPrice: number, cost: number }

    estoque: number,

    dimensions: { largura: number, altura: number, comprimento: number }
    peso: number;
    customProperties?: any,


    //o que vem de CartInfoType
    productId: string,
    quantidade: number,
    userId: string,

    skuId: string,
}



export type CartInfoType = {
    // exist: boolean,
    // id: string,
    productId: string,
    quantidade: number,
    userId: string,

    skuId: string,
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
