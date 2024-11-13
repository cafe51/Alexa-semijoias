import { OrderType, UserType } from '../types';
import { formatOrderTimeline, formatNextSteps, EmailStyles, Header, OrderInfo, ProductList, ShippingInfo, PaymentInfo, PriceSummary, ActionButton, Footer } from './aux/htmlComponents';

export function emailConfirmationHtmlGenerator(
    user: UserType,
    order: OrderType,
): string {
    const { cartSnapShot, paymentOption, installments, valor, createdAt, status, paymentId } = order;

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        ${EmailStyles()}
    </head>
    <body>
        <div class="container">
            ${Header()}
            
            <div class="main-content">
                <p class="thank-you">Pedido Confirmado!</p>
                
                <p>Olá, ${user.nome}!</p>
                <p>Que alegria ter você conosco!${
    status === 'aguardando pagamento' 
        ? 'Seu pedido foi registrado e está aguardando confirmação de pagamento.'
        : 'Seu pedido foi confirmado com sucesso e já está sendo processado com todo o carinho que você merece.'
}</p>
                
                ${OrderInfo(paymentId, createdAt.toDate())}
                ${formatOrderTimeline(status)}
                ${formatNextSteps(status)}
                ${ProductList(cartSnapShot)}
                ${ShippingInfo(order.endereco)}
                ${PaymentInfo(paymentOption, installments)}
                ${PriceSummary(valor, cartSnapShot.reduce((acc, item) => acc + item.quantidade, 0))}
                ${ActionButton(paymentId, status === 'aguardando pagamento' ? 'Realizar Pagamento' : 'Ver Pedido')}
            </div>
            ${Footer()}
        </div>
    </body>
    </html>
    `;
}
