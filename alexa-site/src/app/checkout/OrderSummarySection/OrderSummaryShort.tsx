// app/checkout/OrderSummarySection/OrderSummaryShort.tsx

import formatPrice from '@/app/utils/formatPrice';

interface OrderSummaryShortProps {
    setShowFullOrderSummary: (option: boolean) => void;
    totalPrice: number | undefined,
}

export default function OrderSummaryShort({ setShowFullOrderSummary, totalPrice }: OrderSummaryShortProps) {
    return (
        <section
            className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'
            onClick={ () => { setShowFullOrderSummary(true); } }
        >
            <div className='flex justify-between w-full'>
                <p>Ver resumo</p>
                <p>{ totalPrice ? formatPrice(totalPrice) : '--' }</p>
            </div>
        </section>
    );
}