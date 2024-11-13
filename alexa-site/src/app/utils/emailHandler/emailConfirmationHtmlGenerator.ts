// src/app/utils/emailHandler/emailConfirmationHtmlGenerator.tsx
import { OrderType, UserType } from '../types';
import { formatOrderTimeline, formatNextSteps, Header, OrderInfo, ProductList, ShippingInfo, PaymentInfo, PriceSummary, ActionButton, Footer } from './aux/htmlComponents';

export function emailConfirmationHtmlGenerator(
    user: UserType,
    order: OrderType,
): string {
    const { cartSnapShot, paymentOption, installments, valor, createdAt, status, paymentId } = order;

    return `
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F5F5F5; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333333;">
        <tr>
            <td align="center" style="padding: 10px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 0;">
                            ${Header()}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="text-align: center; padding-bottom: 25px;">
                                        <p style="color: #C48B9F; font-size: 28px; font-weight: 700; margin: 0;">Pedido Confirmado!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; font-size: 16px;">Ol&aacute;, ${user.nome}!</p>
                                        <p style="margin: 15px 0 0 0; font-size: 16px;">Que alegria ter voc&ecirc; conosco!${
    status === 'aguardando pagamento' 
        ? ' Seu pedido foi registrado e est&aacute; aguardando confirma&ccedil;&atilde;o de pagamento.'
        : ' Seu pedido foi confirmado com sucesso e j&aacute; est&aacute; sendo processado com todo o carinho que voc&ecirc; merece.'
}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        ${OrderInfo(paymentId, createdAt.toDate())}
                                        ${formatOrderTimeline(status)}
                                        ${formatNextSteps(status)}
                                        ${ProductList(cartSnapShot)}
                                        ${ShippingInfo(order.endereco)}
                                        ${PaymentInfo(paymentOption, installments)}
                                        ${PriceSummary(valor, cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0))}
                                        ${ActionButton(paymentId, status === 'aguardando pagamento' ? 'Realizar Pagamento' : 'Ver Pedido')}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            ${Footer()}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;
}
