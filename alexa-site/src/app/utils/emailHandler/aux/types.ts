// src/app/utils/emailHandler/aux/types.ts

export interface CustomTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate: () => Date;
  toMillis: () => number;
  isEqual: (other: CustomTimestamp) => boolean;
  valueOf: () => string,
  toJSON: () => {
    seconds: number,
    nanoseconds: number,
  }
}

export type UserType = {
    nome: string,
    email: string,
    userId: string,
    cpf: string,
    phone: string,
    admin: boolean,
    
    address?: AddressType | null
}

export type CartHistoryType = {
    name: string,
    image: string,

    categories: string[],
    barcode: string,

    value: { price: number, promotionalPrice: number, cost: number }
    
    customProperties?: { [key: string]: string },
    productId: string,
    quantidade: number,
    skuId: string,
}

export type ValueType = {
    soma: number,
    frete: number,
    total: number
}

type ViaCepResponse = {
    bairro: string;
    cep: string;
    complemento: string;
    ddd: string;

    estado: string;
    gia: string;
    ibge: string;
    localidade: string;

    logradouro: string;
    regiao: string;
    siafi: string;

    uf: string;
    unidade: string;
};

export type AddressType = { numero: string, referencia: string } & ViaCepResponse;

export type StatusType = 'aguardando pagamento' | 'preparando para o envio' | 'pedido enviado' | 'cancelado' | 'entregue';

export type PixPaymentResponseType = { qrCode: string, qrCodeBase64: string, ticketUrl: string }

export type OrderType = {
    cartSnapShot: CartHistoryType[],
    status: StatusType,
    valor: ValueType,
    userId: string,
    endereco: AddressType

    totalQuantity: number,
    paymentOption: string,
    deliveryOption: string,

    installments?: number | null,

    pixResponse?: PixPaymentResponseType | null;
    paymentId: string;
    createdAt: CustomTimestamp;
    updatedAt: CustomTimestamp;
}