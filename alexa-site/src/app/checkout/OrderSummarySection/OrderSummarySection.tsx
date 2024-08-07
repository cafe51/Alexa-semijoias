// app/checkout/OrderSummarySection/OrderSummarySection.tsx
import OrderSummary from './OrderSummary';
import { ProductCartType, UseCheckoutStateType } from '@/app/utils/types';
import OrderSummaryShort from './OrderSummaryShort';

interface OrderSummarySectionProps {
    state: UseCheckoutStateType;
    carrinho: ProductCartType[] | null;
    cartPrice: number;
    handleShowFullOrderSummary: (option: boolean) => void;
  }

export default function OrderSummarySection({
    state: { showFullOrderSummary, deliveryOption },
    carrinho,
    cartPrice,
    handleShowFullOrderSummary,
}: OrderSummarySectionProps) {

    if (showFullOrderSummary) return (
        <OrderSummary
            handleShowFullOrderSummary={ handleShowFullOrderSummary }
            carrinho={ carrinho }
            frete={ ((deliveryOption?.price) ? deliveryOption?.price : 0) }
            subtotalPrice={ cartPrice }
        />
    );

    return (
        <OrderSummaryShort
            handleShowFullOrderSummary={ handleShowFullOrderSummary }
            totalPrice={
                cartPrice
              +
              ((deliveryOption?.price) ? deliveryOption?.price : 0) //frete
            }
        />
    );
}