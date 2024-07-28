// OrderList.tsx
import { OrderType } from '@/app/utils/types';
import OrderCard from './OrderCard';

interface OrderListProps {
    pedidos?: OrderType[] | null;
}

export default function OrderList({ pedidos }: OrderListProps) {
    return (
        <div className='flex flex-col gap-2 text-sm'>
            { pedidos?.map(pedido => (
                <OrderCard
                    key={ pedido.id }
                    pedido={ pedido }
                />
            )) }
        </div>
    );
}
