import { FireBaseDocument, ProductCartType } from '@/app/utils/types';

export interface QuantityAndPriceSectionProps {
    cartItem: ProductCartType | (ProductCartType & FireBaseDocument);
    removeOne: () => void;
    addOne: () => void;
    setIsLoadingButton: (isLoadingButton: boolean) => void;
    isLoadingButton: boolean;
}

export interface HeaderCartItemProps {
    cartItem: ProductCartType | (ProductCartType & FireBaseDocument);
    removeAll: () => void;
}

export interface CustomPropertiesAndUnitPriceSectionProps {
    cartItem: ProductCartType | (ProductCartType & FireBaseDocument);
}

export interface CartItemProps {
    cartItem: ProductCartType | (ProductCartType & FireBaseDocument);
  }