// src/app/utils/emailHandler/emailConfirmationHtmlGenerator.tsx

import { FireBaseDocument, OrderType, UserType } from '../types';
import { formatOrderTimeline, formatNextSteps, Header, OrderInfo, ProductList, ShippingInfo, PaymentInfo, PriceSummary, ActionButton, Footer } from './aux/htmlComponents';

function convertToDate(timestamp: { seconds: number, nanoseconds: number }): Date {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
    return new Date(milliseconds);
}

export function emailConfirmationHtmlGenerator(
    user: UserType & FireBaseDocument,
    order: OrderType & FireBaseDocument,
): string {
    const { cartSnapShot, paymentOption, installments, valor, createdAt, paymentId } = order;

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
                                        <p style="margin: 15px 0 0 0; font-size: 16px;">
                                            Que alegria ter voc&ecirc; conosco! Seu pedido foi registrado e est&aacute; aguardando confirma&ccedil;&atilde;o de pagamento.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        ${OrderInfo(paymentId, convertToDate(createdAt))}
                                        ${formatOrderTimeline('aguardando pagamento')}
                                        ${formatNextSteps('aguardando pagamento')}
                                        ${ProductList(cartSnapShot)}
                                        ${ShippingInfo(order.endereco)}
                                        ${PaymentInfo(paymentOption, installments)}
                                        ${PriceSummary(valor, cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0))}
                                        ${ActionButton(paymentId, 'Realizar Pagamento')}
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

export function emailPaymentConfirmationHtmlGenerator(
    user: UserType & FireBaseDocument,
    order: OrderType & FireBaseDocument,
): string {
    const { cartSnapShot, paymentOption, installments, valor, createdAt, paymentId } = order;

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
                                        <p style="color: #C48B9F; font-size: 28px; font-weight: 700; margin: 0;">Pagamento Confirmado!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; font-size: 16px;">Ol&aacute;, ${user.nome}!</p>
                                        <p style="margin: 15px 0 0 0; font-size: 16px;">Ótimas notícias! Seu pagamento foi confirmado com sucesso. Agora vamos preparar seu pedido com todo carinho e cuidado que você merece.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        ${OrderInfo(paymentId, convertToDate(createdAt))}
                                        ${formatOrderTimeline('preparando para o envio')}
                                        ${ProductList(cartSnapShot)}
                                        ${ShippingInfo(order.endereco)}
                                        ${PaymentInfo(paymentOption, installments)}
                                        ${PriceSummary(valor, cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0))}
                                        ${ActionButton(paymentId, 'Acompanhar Pedido')}
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

export function emailShippingConfirmationHtmlGenerator(
    user: UserType & FireBaseDocument,
    order: OrderType & FireBaseDocument,
): string {
    const { cartSnapShot, valor, createdAt, paymentId } = order;

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
                                        <p style="color: #C48B9F; font-size: 28px; font-weight: 700; margin: 0;">Pedido Enviado!</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; font-size: 16px;">Ol&aacute;, ${user.nome}!</p>
                                        <p style="margin: 15px 0 0 0; font-size: 16px;">Seu pedido já está a caminho! Em breve você poderá desfrutar das suas novas semijoias.</p>
                                        
                                        ${order.tracknumber ? `
                                            <div style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px dashed #c48b9f;">
                                                <p style="margin: 0; font-size: 14px; color: #666; font-weight: 600;">Código de Rastreio:</p>
                                                <p style="margin: 5px 0 0 0; font-size: 18px; color: #333; font-weight: 700; letter-spacing: 1px;">${order.tracknumber}</p>
                                                
                                                ${(order.deliveryOption?.name?.toLowerCase().includes('pac') || order.deliveryOption?.name?.toLowerCase().includes('sedex')) ? `
                                                    <div style="margin-top: 15px;">
                                                        <a href="https://linketrack.com/track?codigo=${order.tracknumber}" target="_blank" style="display: inline-block; background-color: #333; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: 500;">Rastrear Pedido</a>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        ` : ''}

                                        <p style="margin: 15px 0 0 0; font-size: 16px;">Acompanhe o status da entrega.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        ${OrderInfo(paymentId, convertToDate(createdAt))}
                                        ${formatOrderTimeline('pedido enviado')}
                                        ${ProductList(cartSnapShot)}
                                        ${ShippingInfo(order.endereco)}
                                        ${PriceSummary(valor, cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0))}
                                        ${ActionButton(paymentId, 'Acompanhar Entrega')}
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

export function emailOrderCancellationHtmlGenerator(
    user: UserType & FireBaseDocument,
    order: OrderType & FireBaseDocument,
): string {
    const { cartSnapShot, paymentOption, installments, valor, createdAt, paymentId } = order;

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
                                        <p style="color: #C48B9F; font-size: 28px; font-weight: 700; margin: 0;">Pedido Cancelado</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding-bottom: 25px;">
                                        <p style="margin: 0; font-size: 16px;">Ol&aacute;, ${user.nome}!</p>
                                        <p style="margin: 15px 0 0 0; font-size: 16px;">Seu pedido foi cancelado. Se você já realizou algum pagamento, o estorno será processado em breve.</p>
                                        <p style="margin: 15px 0 0 0; font-size: 16px;">Caso tenha alguma dúvida, entre em contato conosco através do nosso WhatsApp ou redes sociais.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        ${OrderInfo(paymentId, convertToDate(createdAt))}
                                        ${formatOrderTimeline('cancelado')}
                                        ${ProductList(cartSnapShot)}
                                        ${PaymentInfo(paymentOption, installments)}
                                        ${PriceSummary(valor, cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0))}
                                        ${ActionButton(paymentId, 'Fazer Novo Pedido')}
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