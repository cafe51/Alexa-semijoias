// src/app/utils/emailHandler/sendOrderConfirmationEmail.ts
import { OrderType, UserType } from '../types';
import { emailConfirmationHtmlGenerator } from './emailConfirmationHtmlGenerator';
import { formatPrice } from '../formatPrice';

export const sendOrderConfirmationEmail = (userData: UserType, orderId: string, orderData: OrderType) => {
    try {
        if (!userData) {
            throw new Error('Usuário não encontrado ao tentar enviar email de confirmação de compra');
        }

        if (!orderData) {
            throw new Error('Usuário não encontrado ao tentar enviar email de confirmação de compra');
        }

        // Formatar os itens do pedido para o email
        // Atualização do template para os itens da lista
        const itemsList = orderData.cartSnapShot.map(item => {
            return `
              <tr style="border-bottom: 1px solid #F8C3D3;">
                  <td style="padding: 10px; color: #333333;">${item.name}</td>
                  <td style="padding: 10px; text-align: center; color: #333333;">${item.quantidade}</td>
                  <td style="padding: 10px; text-align: right; color: #333333;">${formatPrice(item.value.price)}</td>
                  <td style="padding: 10px; text-align: right; color: #333333;">${formatPrice(item.value.price * item.quantidade)}</td>
              </tr>
          `;
        }).join('');


        const emailHtml = emailConfirmationHtmlGenerator(userData, orderId, orderData, itemsList);

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