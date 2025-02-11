// app/checkout/OrderSummarySection/OrderSummarySection.tsx
import OrderSummary from './OrderSummary';
import { ProductCartType, UseCheckoutStateType } from '@/app/utils/types';
import OrderSummaryShort from './OrderSummaryShort';

interface OrderSummarySectionProps {
  state: UseCheckoutStateType;
  carrinho: ProductCartType[] | null;
  cartPrice: number;
  couponDiscount: number;
  handleShowFullOrderSummary: (option: boolean) => void;
}

export default function OrderSummarySection({
    state: { showFullOrderSummary, deliveryOption },
    carrinho,
    cartPrice,
    couponDiscount,
    handleShowFullOrderSummary,
}: OrderSummarySectionProps) {
    if (showFullOrderSummary) return (
        <OrderSummary
            handleShowFullOrderSummary={ handleShowFullOrderSummary }
            carrinho={ carrinho }
            frete={ deliveryOption?.price || 0 }
            subtotalPrice={ cartPrice }
            couponDiscount={ couponDiscount }
        />
    );

    return (
        <OrderSummaryShort
            handleShowFullOrderSummary={ handleShowFullOrderSummary }
            totalPrice={ (cartPrice - couponDiscount) + (deliveryOption?.price || 0) }
            couponDiscount={ couponDiscount }
        />
    );
}
