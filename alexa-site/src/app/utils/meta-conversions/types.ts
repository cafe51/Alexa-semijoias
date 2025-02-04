import { ProductCartType, OrderType, ProductBundleType, FireBaseDocument, UserType } from '@/app/utils/types';

export interface MetaUserData {
  em?: string[];
  ph?: string[];
  fn?: string[];
  ln?: string[];
  client_ip_address?: string;
  client_user_agent: string;
}

export interface MetaCustomData {
  currency: string;
  value?: number;
  content_ids?: string[];
  content_type?: 'product' | 'product_group';
  contents?: Array<{
    id: string;
    quantity: number;
    item_price?: number;
  }>;
}

export interface MetaEvent {
  event_name: string;
  event_time: number;
  event_id: string;
  event_source_url: string;
  action_source: 'website';
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
}

// Assim é a tipagem para usuários:
// type UserType = {
//     nome: string,
//     email: string,
//     userId: string,
//     cpf: string,
//     phone?: string,
//     admin: boolean,
//     createdAt: Timestamp,
//     address?: AddressType | null
// }

export interface ViewContentParams {
  product: ProductBundleType & FireBaseDocument;
  url: string;
  userData?: FireBaseDocument & UserType
}

export interface AddToCartParams {
  product: ProductBundleType & FireBaseDocument;
  quantity: number;
  url: string;
}

export interface InitiateCheckoutParams {
  cart: ProductCartType[];
  url: string;
}

export interface PurchaseParams {
  order: OrderType;
  url: string;
}
