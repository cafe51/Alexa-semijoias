// src/app/utils/analytics.ts
'use client';
type EventValue = string | number | boolean | null | EventParams | Array<string | number | boolean | null | EventParams>;

type EventParams = {
    [key: string]: EventValue;
};

/**
 * Envia um evento para o Google Analytics
 * @param eventName Nome do evento
 * @param params Parâmetros do evento
 */
export const sendGAEvent = (
    eventName: string,
    params?: EventParams,
) => {
    if (window.gtag) {
        window.gtag('event', eventName, params);
    }
};

/**
 * Envia um evento para o Google Tag Manager
 * @param eventName Nome do evento
 * @param params Parâmetros do evento
 */
export const sendGTMEvent = (
    eventName: string,
    params?: EventParams,
) => {
    console.log('chegou até aqui a COMPRA');
    console.log('window.dataLayer', window.dataLayer);
    if (window.dataLayer) {
        window.dataLayer.push({
            event: eventName,
            ...params,
        });
    }
};

/**
 * Exemplo de uso:
 * 
 * // Para eventos de visualização de produto
 * sendGAEvent('view_item', {
 *   currency: 'BRL',
 *   value: 99.90,
 *   items: [{
 *     item_id: 'SKU123',
 *     item_name: 'Brinco Dourado',
 *     price: 99.90
 *   }]
 * });
 * 
 * // Para eventos de adição ao carrinho
 * sendGAEvent('add_to_cart', {
 *   currency: 'BRL',
 *   value: 99.90,
 *   items: [{
 *     item_id: 'SKU123',
 *     item_name: 'Brinco Dourado',
 *     quantity: 1,
 *     price: 99.90
 *   }]
 * });
 * 
 * // Para eventos personalizados do GTM
 * sendGTMEvent('userAction', {
 *   action: 'click',
 *   label: 'botao_comprar'
 * });
 */
