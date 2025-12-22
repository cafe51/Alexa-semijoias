// src/app/utils/emailHandler/aux/htmlComponents.tsx

import { formatDate } from '../../formatDate';
import { formatPrice } from '../../formatPrice';
import toTitleCase from '../../toTitleCase';
import { AddressType, CartHistoryType, StatusType, ValueType } from '../../types';

export function ActionButton(paymentId: string, label: string): string {
    return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 25px 0;">
                <a href="https://www.alexasemijoias.com.br/pedido/${paymentId}" style="display: inline-block; background-color: #C48B9F; color: white; padding: 20px 40px; border-radius: 8px; text-decoration: none; font-weight: 500; text-align: center; font-size: 18px; min-width: 200px;">${label}</a>
            </td>
        </tr>
    </table>`;
}

export function PriceSummary(value: ValueType, totalItensQuantity: number): string {
    return formatPriceSummary(value, totalItensQuantity);
}

export function PaymentInfo(paymentOption: string, installments?: number | null): string {
    return `
    <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #F8F9FA; border-radius: 8px; margin: 25px 0; border: 1px solid #E9ECEF;">
        <tr>
            <td>
                <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #333;">Informa&ccedil;&otilde;es de Pagamento</h3>
                <p style="margin: 0; font-size: 16px;">M&eacute;todo: ${formatPaymentMethod(paymentOption, installments)}</p>
            </td>
        </tr>
    </table>`;
}

export function ShippingInfo(address: AddressType): string {
    return `
    <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #F8F9FA; border-radius: 8px; margin: 25px 0; border: 1px solid #E9ECEF;">
        <tr>
            <td>
                <h3 style="margin: 0 0 15px 0; font-size: 20px; color: #333;">Endere&ccedil;o de Entrega</h3>
                <p style="margin: 0; white-space: pre-line; font-size: 16px; line-height: 1.6;">${formatAddress(address)}</p>
            </td>
        </tr>
    </table>`;
}

export function ProductList(products: CartHistoryType[]): string {
    return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 25px 0;">
        <tr>
            <td>
                <h3 style="margin: 0 0 20px 0; font-size: 20px; color: #333;">Itens do Pedido</h3>
                ${products.map(formatProductItem).join('')}
            </td>
        </tr>
    </table>`;
}

export function Header(): string {
    const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/alexa-semijoias.appspot.com/o/logo%2FverticalLogo.png?alt=media&token=dab5e38f-cb5f-41fa-9667-d205a2fc6a0f';

    return `
    <table width="100%" cellpadding="35" cellspacing="0" border="0" style="background-color: white; border-radius: 12px 12px 0 0;">
        <tr>
            <td align="center">
                ${logoUrl ? `
                    <img 
                        src="${logoUrl}" 
                        alt="Alexa Semijoias" 
                        width="286"
                        style="display: block; margin: 0 auto; max-width: 286px; width: 100%; height: auto; object-fit: contain;"
                    >
                ` : `
                    <h1 style="font-size: 38px; font-weight: 700; color: #C48B9F; margin: 0; letter-spacing: 2px;">ALEXA</h1>
                    <p style="font-size: 16px; font-weight: 500; color: #666; letter-spacing: 3px; margin-top: 8px; text-transform: uppercase;">SEMIJOIAS</p>
                `}
            </td>
        </tr>
    </table>`;
}

export function OrderInfo(paymentId: string, createdAt: Date): string {
    return `
    <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #F8F9FA; border-radius: 8px; margin: 25px 0; border: 1px solid #E9ECEF;">
        <tr>
            <td align="center">
                <div style="color: #666; font-size: 16px; margin-bottom: 8px;">N&uacute;mero do Pedido</div>
                <div style="color: #C48B9F; font-size: 28px; font-weight: 700; letter-spacing: 1px;">${paymentId}</div>
                <div style="color: #666; font-size: 16px; margin-top: 8px;">Realizado em ${formatDate(createdAt)}</div>
            </td>
        </tr>
    </table>`;
}

function formatPriceSummary(value: ValueType, totalItensQuantity: number): string {
    return `
    <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #F8F9FA; border-radius: 8px; margin: 25px 0; border: 1px solid #E9ECEF;">
        <tr>
            <td>
                <table width="100%" cellpadding="8" cellspacing="0" border="0">
                    <tr>
                        <td style="font-size: 14px; color: #666;">Subtotal (${totalItensQuantity + (totalItensQuantity > 1 ? ' itens' : ' item')}):</td>
                        <td align="right" style="font-size: 14px; color: #666;">${formatPrice(value.soma)}</td>
                    </tr>
                    <tr>
                        <td style="font-size: 14px; color: #666;">Frete:</td>
                        <td align="right" style="font-size: 14px; color: #666;">${formatPrice(value.frete)}</td>
                    </tr>
                    <tr>
                        <td colspan="2" style="border-top: 2px solid #E9ECEF; padding-top: 15px;"></td>
                    </tr>
                    <tr>
                        <td style="font-size: 16px; font-weight: 600; color: #333;">Total:</td>
                        <td align="right" style="font-size: 18px; font-weight: 600; color: #C48B9F;">${formatPrice(value.total)}</td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;
}

function formatProductItem(product: CartHistoryType): string {
    const unitPrice = product.value.promotionalPrice || product.value.price;
    const totalPrice = unitPrice * product.quantidade;

    return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border: 1px solid #E9ECEF; border-radius: 8px; margin-bottom: 15px; background-color: white;">
        <tr>
            <td align="center" style="padding: 20px 20px 0 20px;">
                <table cellpadding="0" cellspacing="0" border="0" style="width: 200px; height: 200px;">
                    <tr>
                        <td align="center" style="width: 200px; height: 200px; background-color: #F8F9FA; border-radius: 8px;">
                            <img src="${product.image}" alt="${toTitleCase(product.name)}" width="180" height="180" style="display: block; border-radius: 8px; object-fit: cover;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td>
                            <h4 style="margin: 0 0 8px 0; font-size: 18px; color: #333;">${product.name}</h4>
                            <p style="margin: 0; font-size: 16px; color: #666;">Quantidade: ${product.quantidade}</p>
                            ${product.customProperties ? `
                            <p style="margin: 8px 0 0 0; font-size: 16px; color: #666;">
                                ${Object.entries(product.customProperties).map(([key, value]) => `${toTitleCase(key)}: ${value}`).join('<br>')}
                            </p>` : ''}
                        </td>
                    </tr>
                    <tr>
                        <td align="right" style="padding-top: 15px;">
                            <div style="margin-bottom: 5px;">
                                ${product.value.promotionalPrice ? `
                                    <div style="color: #C48B9F; font-weight: 600; font-size: 20px;">${formatPrice(product.value.promotionalPrice)} <small style="color: #666; font-size: 14px;">(unitário)</small></div>
                                    <div style="text-decoration: line-through; color: #666; font-size: 16px;">${formatPrice(product.value.price)}</div>
                                ` : `
                                    <div style="color: #C48B9F; font-weight: 600; font-size: 20px;">${formatPrice(product.value.price)} <small style="color: #666; font-size: 14px;">(unitário)</small></div>
                                `}
                            </div>
                            <div style="color: #333; font-size: 18px; font-weight: 700;">Total: ${formatPrice(totalPrice)}</div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;
}


function formatAddress(address: AddressType): string {
    let formattedAddress = `${address.logradouro}, ${address.numero}`;
    if (address.complemento) {
        formattedAddress += `, ${address.complemento}`;
    }
    formattedAddress += `\n${address.bairro}\n${address.localidade} - ${address.uf}\nCEP: ${address.cep}`;
    if (address.referencia) {
        formattedAddress += `\nRefer&ecirc;ncia: ${address.referencia}`;
    }
    return formattedAddress;
}

function formatPaymentMethod(paymentOption: string, installments?: number | null): string {
    let paymentInfo = paymentOption;
    if (installments && installments > 1) {
        paymentInfo += `, Parcelado em ${installments}x`;
    }
    return paymentInfo;
}

function getStatusIcon(status: StatusType): string {
    const icons: Record<StatusType, string> = {
        'aguardando pagamento': '&#128179;', // 💳
        'preparando para o envio': '&#128230;', // 📦
        'pedido enviado': '&#128666;', // 🚚
        'entregue': '&#9989;', // ✅
        'cancelado': '&#10060;', // ❌
    };
    return icons[status];
}

export function formatOrderTimeline(status: StatusType): string {
    const steps = [
        { key: 'aguardando pagamento' as StatusType, label: 'Aguardando Pagamento' },
        { key: 'preparando para o envio' as StatusType, label: 'Preparando Envio' },
        { key: 'pedido enviado' as StatusType, label: 'Enviado' },
        { key: 'entregue' as StatusType, label: 'Entregue' },
    ];

    if (status === 'cancelado') {
        return `
        <table width="100%" cellpadding="25" cellspacing="0" border="0">
            <tr>
                <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="center" style="padding: 10px;">
                                <div style="width: 50px; height: 50px; background: #C48B9F; border-radius: 50%; color: white; font-size: 24px; line-height: 50px;">&#10060;</div>
                                <div style="margin-top: 12px; font-size: 18px; color: #333; font-weight: 600;">Pedido Cancelado</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;
    }

    const currentStepIndex = steps.findIndex(step => step.key === status);

    return `
    <table width="100%" cellpadding="25" cellspacing="0" border="0">
        <tr>
            <td>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        ${steps.map((step, index) => `
                            <td align="center" style="opacity: ${index <= currentStepIndex ? '1' : '0.5'};">
                                <div style="width: 50px; height: 50px; background: ${index <= currentStepIndex ? '#C48B9F' : '#F8F9FA'}; border: 2px solid ${index <= currentStepIndex ? '#C48B9F' : '#E9ECEF'}; border-radius: 50%; color: ${index <= currentStepIndex ? 'white' : '#666'}; font-size: 24px; line-height: 50px;">${getStatusIcon(step.key)}</div>
                                <div style="margin-top: 12px; font-size: 14px; color: ${index <= currentStepIndex ? '#333' : '#666'}; font-weight: ${index <= currentStepIndex ? '600' : '500'};">${step.label}</div>
                            </td>
                            ${index < steps.length - 1 ? `
                            <td style="width: 50px;">
                                <div style="height: 2px; background: #E9ECEF; margin-top: 25px;"></div>
                            </td>` : ''}
                        `).join('')}
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;
}

export function formatNextSteps(status: StatusType): string {
    if (status === 'cancelado') return '';

    if (status === 'aguardando pagamento') {
        return `
        <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #F8F9FA; border-radius: 8px; margin: 25px 0;">
            <tr>
                <td>
                    <h3 style="margin: 0 0 25px 0; font-size: 20px; color: #333;">Pr&oacute;ximos Passos</h3>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td style="padding-bottom: 25px;">
                                <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="30" style="vertical-align: top;">
                                            <div style="width: 30px; height: 30px; background: #C48B9F; color: white; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 600; font-size: 16px;">1</div>
                                        </td>
                                        <td style="padding-left: 20px;">
                                            <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">Realize o Pagamento</h4>
                                            <p style="margin: 0; color: #666; font-size: 16px;">Acesse a p&aacute;gina do seu pedido para visualizar as op&ccedil;&otilde;es de pagamento dispon&iacute;veis.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td width="30" style="vertical-align: top;">
                                            <div style="width: 30px; height: 30px; background: #C48B9F; color: white; border-radius: 50%; text-align: center; line-height: 30px; font-weight: 600; font-size: 16px;">2</div>
                                        </td>
                                        <td style="padding-left: 20px;">
                                            <h4 style="margin: 0 0 8px 0; color: #333; font-size: 18px;">Acompanhe o Status</h4>
                                            <p style="margin: 0; color: #666; font-size: 16px;">Ap&oacute;s a confirma&ccedil;&atilde;o do pagamento, voc&ecirc; receber&aacute; atualiza&ccedil;&otilde;es sobre o processamento do seu pedido.</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`;
    }

    return '';
}

export function Footer(): string {
    return `
    <table width="100%" cellpadding="25" cellspacing="0" border="0" style="background-color: #f5f5f5; border-top: 1px solid #e5e5e5;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%;">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <a href="https://www.instagram.com/alexa.semijoias/" style="color: #666; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 600;">Instagram</a>
                            <a href="https://www.facebook.com/alexasemijoias/" style="color: #666; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 600;">Facebook</a>
                            <a href="https://api.whatsapp.com/message/Y2ON3VGEHF4JP1?autoload=1&app_absent=0" style="color: #666; text-decoration: none; margin: 0 15px; font-size: 14px; font-weight: 600;">WhatsApp</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 10px; color: #999; font-size: 12px; line-height: 1.5;">
                            <p style="margin: 0;">Voc&ecirc; est&aacute; recebendo este e-mail porque realizou uma compra ou se cadastrou em nosso site.</p>
                            <p style="margin: 5px 0 0 0;">Alexa Semijoias &bullet; Enviamos com amor para todo o Brasil.</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-top: 15px; border-top: 1px solid #e5e5e5; color: #999; font-size: 12px;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Alexa Semijoias. Todos os direitos reservados.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>`;
}
