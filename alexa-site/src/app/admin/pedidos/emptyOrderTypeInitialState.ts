import { FireBaseDocument, OrderType } from '@/app/utils/types';
import { Timestamp } from 'firebase/firestore';

export const emptyOrderTypeInitialState: OrderType & FireBaseDocument = {
    exist: false,
    id: '',
    cartSnapShot: [],
    status: 'aguardando pagamento',
    valor: {
        frete: 0,
        soma: 0,
        total: 0,
    },
    userId: '',
    endereco: {
        bairro: '',
        cep: '',
        complemento: '',
        ddd: '',
        gia: '',
        ibge: '',
        localidade: '',
        logradouro: '',
        numero: '',
        siafi: '',
        uf: '',
        unidade: '',
        referencia: '',
    },
    date: Timestamp.now(),
    totalQuantity: 0,
    paymentOption: '',
    deliveryOption: '',
};