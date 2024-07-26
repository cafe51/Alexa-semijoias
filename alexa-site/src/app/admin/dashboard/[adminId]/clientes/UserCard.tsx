// UserCard.tsx
import { FaWhatsapp } from 'react-icons/fa';
import { CiMail } from 'react-icons/ci';
import { FilterOption, OrderType, UserType } from '@/app/utils/types';
import { useEffect, useMemo, useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import formatPrice from '@/app/utils/formatPrice';

interface UserCardProps {
    user?: UserType;
    onEmailClick: () => void;
    onWhatsAppClick: () => void;
}

export default function UserCard({ user, onEmailClick, onWhatsAppClick }: UserCardProps){
    const [pedidos, setPedidos] = useState<OrderType[] | null>(null);
    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    const userQuery = useMemo<FilterOption[]>(() => 
        [{ field: 'userId', operator: '==', value: user ? user.userId : 'invalidId' }],
    [user], // Só recriar a query quando 'user' mudar
    );

    useEffect(() => {
        async function getOrders() {
            const orders = user ? await getAllDocuments(userQuery) : null;

            setPedidos(orders);
        }
        getOrders();
    }, [userQuery]);

    const sumOfPrices = () => {
        const sum = pedidos?.map((pedido) => pedido.valor.soma).reduce((a, b) => a + b, 0);
        if(sum) return formatPrice(sum);
        return 0;
    };

    return (
        <div className="flex items-end flex-col border-b py-4 gap-4 ">
            <div className="flex justify-between items-center gap-4 w-full">
                <a
                    onClick={ () => console.log('pedidos do usuário', user?.nome, pedidos?.map((pedido) => pedido.valor.soma).reduce((a, b) => a + b, 0)) }
                    href="#"
                    className="text-blue-500">
                    { user?.nome }
                </a>
                <div>
                    <button onClick={ onEmailClick } className="border p-2 rounded-full">
                        <CiMail size={ 24 }/>
                    </button>
                    <button onClick={ onWhatsAppClick } className="border p-2 rounded-full">
                        <FaWhatsapp size={ 24 }/>
                    </button>

                </div>
            </div>
            <span>{ sumOfPrices() } consumidos</span>
        </div>
    );
}
