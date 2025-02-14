import { FireBaseDocument, OrderType } from '@/app/utils/types';

export function consoleLogPreparandoEnvio(orderData: OrderType & FireBaseDocument) {
    console.log('*******************************');
    console.log('*******************************');
    console.log('status atual:', orderData.status);
    console.log('*******************************');
    console.log('*******************************');
}

export function consoleLogEmailEnviado() {
    console.log('*******************************');
    console.log('*******************************');
    console.log('CHEGOU AQUI E O EMAIL FOI ENVIADO');
    console.log('*******************************');
    console.log('*******************************');
}