declare global {
    interface Window {
        fbq: (...args: any[]) => void;
    }
}

type StandardEvents = 
    | 'AddPaymentInfo'
    | 'AddToCart'
    | 'AddToWishlist'
    | 'CompleteRegistration'
    | 'Contact'
    | 'CustomizeProduct'
    | 'Donate'
    | 'FindLocation'
    | 'InitiateCheckout'
    | 'Lead'
    | 'Purchase'
    | 'Schedule'
    | 'Search'
    | 'StartTrial'
    | 'SubmitApplication'
    | 'Subscribe'
    | 'ViewContent';

interface BaseEventParams {
    content_category?: string;
    content_ids?: (string | number)[];
    content_name?: string;
    content_type?: 'product' | 'product_group';
    contents?: Array<{
        id: string;
        quantity: number;
    }>;
    currency?: string;
    value?: number;
    delivery_category?: 'home_delivery' | 'in_store' | 'curbside';
    predicted_ltv?: number;
    num_items?: number;
    status?: boolean;
    search_string?: string;
}

export const trackPixelEvent = <T extends BaseEventParams>(
    eventName: StandardEvents,
    params?: T,
): void => {
    try {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', eventName, params);
        }
    } catch (error) {
        console.error('Erro ao rastrear evento do Meta Pixel:', error);
    }
};

export const trackCustomPixelEvent = <T extends BaseEventParams>(
    eventName: string,
    params?: T,
): void => {
    try {
        if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('trackCustom', eventName, params);
        }
    } catch (error) {
        console.error('Erro ao rastrear evento customizado do Meta Pixel:', error);
    }
};
