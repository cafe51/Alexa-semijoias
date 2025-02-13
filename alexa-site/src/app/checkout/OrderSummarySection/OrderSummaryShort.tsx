// app/checkout/OrderSummarySection/OrderSummaryShort.tsx
import { formatPrice } from '@/app/utils/formatPrice';

interface OrderSummaryShortProps {
    handleShowFullOrderSummary: (option: boolean) => void;
    totalPrice: number | undefined,
    couponDiscount: number | 'freteGratis';
}

export default function OrderSummaryShort({ handleShowFullOrderSummary, totalPrice }: OrderSummaryShortProps) {
    return (
        <section
            className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'
            onClick={ () => { handleShowFullOrderSummary(true); } }
        >
            <div className='flex justify-between w-full'>
                <p>Ver resumo</p>
                <p>{ totalPrice ? formatPrice(totalPrice) : '--' }</p>
            </div>
        </section>
    );
}