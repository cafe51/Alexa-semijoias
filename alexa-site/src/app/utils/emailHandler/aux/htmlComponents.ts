// src/app/utils/emailHandler/aux/htmlComponents.ts

import { formatDate } from '../../formatDate';
import { formatPrice } from '../../formatPrice';
import toTitleCase from '../../toTitleCase';
import { AddressType, CartHistoryType, StatusType, ValueType } from '../../types';

// Botão de ação
export function ActionButton(paymentId: string, label: string): string {
    return `
    <center>
        <a href="https://www.alexasemijoias.com.br/pedido/${paymentId}" class="button">${label}</a>
    </center>`;
}

// Resumo do preço
export function PriceSummary(value: ValueType, totalItensQuantity: number): string {
    return formatPriceSummary(value, totalItensQuantity);
}

// Informações de pagamento
export function PaymentInfo(paymentOption: string, installments?: number | null): string {
    return `
    <div class="payment-info">
        <h3>Informações de Pagamento</h3>
        <p>Método: ${formatPaymentMethod(paymentOption, installments)}</p>
    </div>`;
}

// Endereço de entrega
export function ShippingInfo(address: AddressType): string {
    return `
    <div class="shipping-info">
        <h3>Endereço de Entrega</h3>
        <p>${formatAddress(address)}</p>
    </div>`;
}

// Lista de produtos do pedido
export function ProductList(products: CartHistoryType[]): string {
    return `
    <div class="products-list">
        <h3>Itens do Pedido</h3>
        ${products.map(formatProductItem).join('')}
    </div>`;
}

// Cabeçalho com o nome da marca
export function Header(): string {
    return `
    <div class="header">
        <div class="logo-container">
            <h1 class="brand-name">ALEXA</h1>
            <p class="sub-brand">SEMIJOIAS</p>
        </div>
    </div>`;
}

// Número e data do pedido
export function OrderInfo(paymentId: string, createdAt: Date): string {
    return `
    <div class="order-number">
        <div class="label">Número do Pedido</div>
        <div class="number">${paymentId}</div>
        <div class="date">Realizado em ${formatDate(createdAt)}</div>
    </div>`;
}

export function EmailStyles(): string {
    return `
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F5F5F5;
            margin: 0;
            padding: 0;
            color: #333333;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 30px 0;
            background-color: white;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .logo-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .brand-name {
            font-size: 32px;
            font-weight: 700;
            color: #C48B9F;
            margin: 0;
            letter-spacing: 2px;
        }
        .sub-brand {
            font-size: 14px;
            font-weight: 500;
            color: #666;
            letter-spacing: 3px;
            margin-top: 5px;
            text-transform: uppercase;
        }
        .main-content {
            background-color: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .thank-you {
            color: #C48B9F;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            text-align: center;
        }
        .order-number {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            border: 1px solid #E9ECEF;
        }
        .order-number .label {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .order-number .number {
            color: #C48B9F;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .order-number .date {
            color: #666;
            font-size: 14px;
            margin-top: 5px;
        }
        .timeline {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 0;
            position: relative;
            padding: 20px 0;
        }
        .timeline-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            z-index: 1;
            flex: 1;
            opacity: 0.5;
        }
        .timeline-item.active {
            opacity: 1;
        }
        .timeline-icon {
            width: 40px;
            height: 40px;
            background: #F8F9FA;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            border: 2px solid #E9ECEF;
            font-size: 20px;
        }
        .timeline-item.active .timeline-icon {
            background: #C48B9F;
            border-color: #C48B9F;
            color: white;
        }
        .timeline-content {
            font-size: 12px;
            font-weight: 500;
            text-align: center;
            color: #666;
        }
        .timeline-item.active .timeline-content {
            color: #333;
            font-weight: 600;
        }
        .timeline-line {
            height: 2px;
            background: #E9ECEF;
            flex: 1;
            margin: 0 10px;
            position: relative;
            top: -20px;
        }
        .next-steps {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .next-steps h3 {
            color: #333;
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 18px;
        }
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .step:last-child {
            margin-bottom: 0;
        }
        .step-number {
            width: 24px;
            height: 24px;
            background: #C48B9F;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .step-content h4 {
            margin: 0 0 5px 0;
            color: #333;
            font-size: 16px;
        }
        .step-content p {
            margin: 0;
            color: #666;
            font-size: 14px;
        }
        .products-list {
            margin: 20px 0;
        }
        .product-item {
            display: flex;
            align-items: center;
            padding: 15px;
            border: 1px solid #E9ECEF;
            border-radius: 8px;
            margin-bottom: 10px;
        }
        .product-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 15px;
        }
        .product-info {
            flex-grow: 1;
        }
        .product-info h4 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #333;
        }
        .product-info p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        .product-price {
            text-align: right;
            min-width: 100px;
        }
        .promotional-price {
            color: #C48B9F;
            font-weight: 600;
            font-size: 16px;
        }
        .original-price {
            text-decoration: line-through;
            color: #666;
            font-size: 14px;
        }
        .shipping-info {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #E9ECEF;
        }
        .shipping-info h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #333;
        }
        .payment-info {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #E9ECEF;
        }
        .payment-info h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            color: #333;
        }
        .price-summary {
            background-color: #F8F9FA;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            border: 1px solid #E9ECEF;
        }
        .price-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
        .total-row {
            font-weight: 600;
            color: #333;
            border-top: 2px solid #E9ECEF;
            padding-top: 10px;
            margin-top: 10px;
            font-size: 16px;
        }
        .total-row .amount {
            color: #C48B9F;
            font-size: 20px;
        }
        .button {
            display: inline-block;
            background-color: #C48B9F;
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            margin: 20px 0;
            font-weight: 500;
            text-align: center;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #B47B8F;
        }
        .footer {
            text-align: center;
            padding: 30px 0;
            color: #666;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #C48B9F;
            margin: 0 10px;
            text-decoration: none;
            font-weight: 500;
        }
        @media (max-width: 600px) {
            .container {
                padding: 10px;
            }
            .main-content {
                padding: 20px;
            }
            .timeline {
                flex-direction: column;
                align-items: flex-start}
            .timeline-item {
                width: 100%;
                margin-bottom: 15px;
                flex-direction: row;
                align-items: center;
            }
            .timeline-icon {
                margin-bottom: 0;
                margin-right: 15px;
            }
            .timeline-content {
                text-align: left;
            }
            .timeline-line {
                display: none;
            }
            .product-item {
                flex-direction: column;
                text-align: center;
            }
            .product-image {
                margin: 0 auto 15px;
            }
            .product-info {
                text-align: center;
                margin-bottom: 10px;
            }
            .product-price {
                text-align: center;
            }
            .price-row {
                font-size: 13px;
            }
            .button {
                width: 100%;
                box-sizing: border-box;
            }
        }
    </style>
    `;
}

export function formatPriceSummary(value: ValueType, totalItensQuantity: number): string {
    return `
  <div class="price-summary">
    <div class="price-row">
      <span>Subtotal (${ totalItensQuantity + (totalItensQuantity > 1 ? ' itens' : ' item') }):</span>
      <span>${formatPrice(value.soma)}</span>
    </div>
    <div class="price-row">
      <span>Frete:</span>
      <span>${formatPrice(value.frete)}</span>
    </div>
    <div class="price-row total-row">
      <span>Total:</span>
      <span>${formatPrice(value.total)}</span>
    </div>
  </div>
`;
}

export function formatPaymentMethod(paymentOption: string, installments?: number | null): string {
    let paymentInfo = paymentOption;
    if (installments && installments > 1) {
        paymentInfo += `, Parcelado em ${installments}x`;
    }
    return paymentInfo;
}

export function formatProductItem(product: CartHistoryType): string {
    let productItem = `
  <div class="product-item">
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <div class="product-info">
      <h4>${product.name}</h4>
      <p>Quantidade: ${product.quantidade}</p>
`;

    if (product.customProperties) {
        productItem += `
    <p>
      ${Object.entries(product.customProperties).map(([key, value]) => `${toTitleCase(key)}: ${value}`).join('<br>')}
    </p>
  `;
    }

    productItem += `
    </div>
    <div class="product-price">
      ${product.value.promotionalPrice
        ? `
          <div class="promotional-price">${formatPrice(product.value.promotionalPrice)}</div>
          <div class="original-price">${formatPrice(product.value.price)}</div>
        `
        : `
          <div class="promotional-price">${formatPrice(product.value.price)}</div>
        `}
    </div>
  </div>
`;

    return productItem;
}

export function formatAddress(address: AddressType): string {
    let formattedAddress = `${address.logradouro}, ${address.numero}`;
    if (address.complemento) {
        formattedAddress += `, ${address.complemento}`;
    }
    formattedAddress += `\n${address.bairro}\n${address.localidade} - ${address.uf}\nCEP: ${address.cep}`;
    if (address.referencia) {
        formattedAddress += `\nReferência: ${address.referencia}`;
    }
    return formattedAddress;
}

export function getStatusIcon(status: StatusType): string {
    const icons = {
        'aguardando pagamento': '💳',
        'preparando para o envio': '📦',
        'pedido enviado': '🚚',
        'entregue': '✅',
        'cancelado': '❌',
    };
    return icons[status];
}

export function formatOrderTimeline(status: StatusType): string {
    const steps = [
        { key: 'aguardando pagamento', label: 'Aguardando Pagamento' },
        { key: 'preparando para o envio', label: 'Preparando Envio' },
        { key: 'pedido enviado', label: 'Enviado' },
        { key: 'entregue', label: 'Entregue' },
    ];

    const currentStepIndex = steps.findIndex(step => step.key === status);
    if (status === 'cancelado') {
        return `
            <div class="timeline cancelled">
                <div class="timeline-item active">
                    <div class="timeline-icon">❌</div>
                    <div class="timeline-content">Pedido Cancelado</div>
                </div>
            </div>
        `;
    }

    return `
        <div class="timeline">
            ${steps.map((step, index) => `
                <div class="timeline-item ${index <= currentStepIndex ? 'active' : ''}">
                    <div class="timeline-icon">${getStatusIcon(step.key as StatusType)}</div>
                    <div class="timeline-content">${step.label}</div>
                </div>
                ${index < steps.length - 1 ? '<div class="timeline-line"></div>' : ''}
            `).join('')}
        </div>
    `;
}

export function formatNextSteps(status: StatusType): string {
    if (status === 'cancelado') return '';
    
    if (status === 'aguardando pagamento') {
        return `
            <div class="next-steps">
                <h3>Próximos Passos</h3>
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h4>Realize o Pagamento</h4>
                        <p>Acesse a página do seu pedido para visualizar as opções de pagamento disponíveis.</p>
                    </div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h4>Acompanhe o Status</h4>
                        <p>Após a confirmação do pagamento, você receberá atualizações sobre o processamento do seu pedido.</p>
                    </div>
                </div>
            </div>
        `;
    }

    return '';
}

export function Footer() {
    return `
        <div class="footer" style="text-align: center; padding: 20px; background-color: #f5f5f5; color: #666;">
            <div class="social-links" style="margin-bottom: 10px;">
                <a href="https://www.instagram.com/alexa.semijoias/" style="color: #666; text-decoration: none; margin: 0 5px;">Instagram</a> |
                <a href="https://www.facebook.com/alexasemijoias/" style="color: #666; text-decoration: none; margin: 0 5px;">Facebook</a> |
                <a href="https://api.whatsapp.com/message/Y2ON3VGEHF4JP1?autoload=1&app_absent=0" style="color: #666; text-decoration: none; margin: 0 5px;">WhatsApp</a>
            </div>
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Alexa Semijoias. Todos os direitos reservados.</p>
            <small style="color: #999;">Este é um e-mail automático, por favor não responda.</small>
        </div>
    `;
}