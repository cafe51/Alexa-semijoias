import { v4 as uuidv4 } from 'uuid';
import { META_CONSTANTS, EVENT_NAMES, META_TEST_MODE } from './constants';
import { HashUtils } from './hash-utils';
import type { 
    MetaEvent, 
    ViewContentParams,
    AddToCartParams,
    InitiateCheckoutParams,
    PurchaseParams,
} from './types';
import { UserType } from '@/app/utils/types';

export class MetaConversionsService {
    private static instance: MetaConversionsService;
    private readonly apiUrl: string;
    private constructor() {
        this.apiUrl = `${META_CONSTANTS.API_URL}/${META_CONSTANTS.API_VERSION}/${META_CONSTANTS.PIXEL_ID}/events`;
    }

    public static getInstance(): MetaConversionsService {
        if (!MetaConversionsService.instance) {
            MetaConversionsService.instance = new MetaConversionsService();
        }
        return MetaConversionsService.instance;
    }

    private async getClientIp(): Promise<string | undefined> {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Failed to get client IP:', error);
            return undefined;
        }
    }

    private async sendEvent(event: MetaEvent): Promise<void> {
        try {
            // Adiciona o IP do cliente aos dados do usuário se não houver dados de usuário com hash
            if (!event.user_data.em && !event.user_data.ph && !event.user_data.fn) {
                const clientIp = await this.getClientIp();
                if (clientIp) {
                    event.user_data.client_ip_address = clientIp;
                }
            }

            const payload = {
                data: [event],
                ...(META_TEST_MODE && { test_event_code: META_CONSTANTS.TEST_EVENT_CODE }),
            };

            const response = await fetch(`${this.apiUrl}?access_token=${META_CONSTANTS.ACCESS_TOKEN}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Meta Conversions API Error: ${JSON.stringify(error)}`);
            }
        } catch (error) {
            console.error('Failed to send event to Meta:', error);
            throw error;
        }
    }

    private createBaseEvent(
        eventName: string,
        url: string,
        userData?: Partial<UserType>,
    ): MetaEvent {
        const event: MetaEvent = {
            event_name: eventName,
            event_time: Math.floor(Date.now() / 1000),
            event_id: uuidv4(),
            event_source_url: url,
            action_source: 'website',
            user_data: {
                client_user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
                ...userData ? HashUtils.hashUserData({
                    email: userData.email,
                    phone: userData.phone,
                    firstName: userData.nome?.split(' ')[0],
                    lastName: userData.nome?.split(' ').slice(1).join(' '),
                }) : {},
            },
        };

        return event;
    }

    public async sendViewContent({ product, url, userData }: ViewContentParams): Promise<void> {
        const event = this.createBaseEvent(EVENT_NAMES.VIEW_CONTENT, url, userData);

        console.log('visualizando produto e enviando para o meta');
        console.log('produto visualizado:', product);
        console.log('url:', url);
        
        event.custom_data = {
            currency: META_CONSTANTS.CURRENCY,
            value: product.finalPrice,
            content_ids: [product.id],
            content_type: 'product',
            contents: [{
                id: product.id,
                quantity: 1,
                item_price: product.finalPrice,
            }],
        };

        await this.sendEvent(event);
    }

    public async sendAddToCart({ product, quantity, url }: AddToCartParams): Promise<void> {
        const event = this.createBaseEvent(EVENT_NAMES.ADD_TO_CART, url);

        console.log('adicionou ao carrinho e enviou para o meta');
        console.log('produto adicionado:', product);
        console.log('quantidade adicionada:', quantity);
        console.log('url:', url);

        
        event.custom_data = {
            currency: META_CONSTANTS.CURRENCY,
            value: product.finalPrice * quantity,
            content_ids: [product.id],
            content_type: 'product',
            contents: [{
                id: product.id,
                quantity,
                item_price: product.finalPrice,
            }],
        };

        await this.sendEvent(event);
    }

    public async sendInitiateCheckout({ cart, url }: InitiateCheckoutParams): Promise<void> {
        const event = this.createBaseEvent(EVENT_NAMES.INITIATE_CHECKOUT, url);
        
        const totalValue = cart.map((item) => (Number(item.value.promotionalPrice || item.value.price) * item.quantidade)).reduce((a, b) => a + b, 0);
        
        event.custom_data = {
            currency: META_CONSTANTS.CURRENCY,
            value: totalValue,
            content_ids: cart.map(item => item.skuId),
            content_type: 'product',
            contents: cart.map(item => ({
                id: item.skuId,
                quantity: item.quantidade,
                item_price: item.value.promotionalPrice || item.value.price,
            })),
        };

        await this.sendEvent(event);
    }

    public async sendPurchase({ order, url }: PurchaseParams): Promise<void> {
        const event = this.createBaseEvent(EVENT_NAMES.PURCHASE, url);
        
        event.custom_data = {
            currency: META_CONSTANTS.CURRENCY,
            value: order.valor.total,
            content_ids: order.cartSnapShot.map(item => item.skuId),
            content_type: 'product',
            contents: order.cartSnapShot.map(item => ({
                id: item.skuId,
                quantity: item.quantidade,
                item_price: item.value.promotionalPrice || item.value.price,
            })),
        };

        await this.sendEvent(event);
    }
}
