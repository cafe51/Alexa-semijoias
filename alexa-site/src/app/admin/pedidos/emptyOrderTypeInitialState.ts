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

        estado: '',
        regiao: '',
    },
    updatedAt: Timestamp.now(),
    createdAt: Timestamp.now(),
    paymentId: 'mockPaymentId',
    totalQuantity: 0,
    paymentOption: '',
    deliveryOption: { deliveryTime: 0, name: '', price: 0 },
};
