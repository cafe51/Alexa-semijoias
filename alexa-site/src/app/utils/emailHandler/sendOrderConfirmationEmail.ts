// src/app/utils/emailHandler/sendOrderConfirmationEmail.ts
import { OrderType, UserType } from '../types';
import { emailConfirmationHtmlGenerator } from './emailConfirmationHtmlGenerator';

export const sendOrderConfirmationEmail = (userData: UserType, orderId: string, orderData: OrderType) => {
    try {
        if (!userData) {
            throw new Error('Usuário não encontrado ao tentar enviar email de confirmação de compra');
        }

        if (!orderData) {
            throw new Error('Usuário não encontrado ao tentar enviar email de confirmação de compra');
        }

        const emailHtml = emailConfirmationHtmlGenerator(userData, orderData);

        const msg = {
            to: userData.email,
            from: 'contato@alexasemijoias.com.br',
            subject: `Alexa Semijoias - Confirmação do Pedido #${orderId}`,
            html: emailHtml,
        };

        return msg;

    } catch (error) {
        console.error('Erro ao criar gerar mensagem de confirmação de compra:', error); 
    }
};