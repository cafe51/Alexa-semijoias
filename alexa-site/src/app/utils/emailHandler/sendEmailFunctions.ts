// src/app/utils/emailHandler/sendEmailFunctions.ts

import { FireBaseDocument, OrderType, UserType } from '../types';
import { 
    emailConfirmationHtmlGenerator, 
    emailOrderCancellationHtmlGenerator, 
    emailPaymentConfirmationHtmlGenerator, 
    emailShippingConfirmationHtmlGenerator, 
} from './emailHtmlGenerator';

type EmailType = 'orderConfirmation' | 'paymentConfirmation' | 'shippingConfirmation' | 'orderCancellation';

const emailGenerators = {
    orderConfirmation: emailConfirmationHtmlGenerator,
    paymentConfirmation: emailPaymentConfirmationHtmlGenerator,
    shippingConfirmation: emailShippingConfirmationHtmlGenerator,
    orderCancellation: emailOrderCancellationHtmlGenerator,
};

const emailSubjects = {
    orderConfirmation: 'Confirmação do Pedido',
    paymentConfirmation: 'Pagamento Aprovado',
    shippingConfirmation: 'Pedido Enviado',
    orderCancellation: 'Pedido Cancelado',
};

export const sendEmail = (
    emailType: EmailType,
    userData: UserType & FireBaseDocument,
    orderId: string,
    orderData: OrderType & FireBaseDocument,
) => {
    try {
        if (!userData) {
            throw new Error(`Usuário não encontrado ao tentar enviar email de ${emailSubjects[emailType].toLowerCase()}`);
        }

        if (!orderData) {
            throw new Error(`Dados do pedido não encontrados ao tentar enviar email de ${emailSubjects[emailType].toLowerCase()}`);
        }

        const emailHtml = emailGenerators[emailType](userData, orderData);

        return {
            to: userData.email,
            from: 'contato@alexasemijoias.com.br',
            subject: `Alexa Semijoias - ${emailSubjects[emailType]} #${orderId}`,
            html: emailHtml,
        };

    } catch (error) {
        console.error(`Erro ao criar mensagem de ${emailSubjects[emailType].toLowerCase()}:`, error);
    }
};

// export const sendOrderConfirmationEmail = (userData: UserType & FireBaseDocument, orderId: string, orderData: OrderType & FireBaseDocument) => 
//     sendEmail('orderConfirmation', userData, orderId, orderData);

// export const sendOrderPaymentConfirmationEmail = (userData: UserType & FireBaseDocument, orderId: string, orderData: OrderType & FireBaseDocument) => 
//     sendEmail('paymentConfirmation', userData, orderId, orderData);

// export const sendOrderShippingConfirmationEmail = (userData: UserType & FireBaseDocument, orderId: string, orderData: OrderType & FireBaseDocument) => 
//     sendEmail('shippingConfirmation', userData, orderId, orderData);

// export const sendOrderCancellationEmail = (userData: UserType & FireBaseDocument, orderId: string, orderData: OrderType & FireBaseDocument) => 
//     sendEmail('orderCancellation', userData, orderId, orderData);
