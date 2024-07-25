// UserCard.tsx
import { FaWhatsapp } from 'react-icons/fa';
import { CiMail } from 'react-icons/ci';
import { OrderType, UserType } from '@/app/utils/types';
import { useEffect, useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';

interface UserCardProps {
    user?: UserType;
    amountSpent?: number;
    onEmailClick: () => void;
    onWhatsAppClick: () => void;
}

export default function UserCard({ user, amountSpent, onEmailClick, onWhatsAppClick }: UserCardProps){
    const [pedidos, setPedidos] = useState<OrderType[] | null>(null);
    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    // const userQuery = useMemo<FilterOption[]>(() => 
    //     [{ field: 'userId', operator: '==', value: user ? user.userId : 'invalidId' }],
    // [user], // Só recriar a query quando 'user' mudar
    // );

    useEffect(() => {
        async function getOrders() {
            const orders = user ? await getAllDocuments([{ field: 'userId', operator: '==', value: user.userId }]) : null;

            setPedidos(orders);
        }
        getOrders();
    }, [user]);

    return (
        <div className="flex items-end flex-col border-b py-4 gap-4 ">
            <div className="flex justify-between items-center gap-4 w-full">
                <a onClick={ () => console.log('pedidos do usuário', user?.nome, pedidos?.map((pedido) => pedido.valor.soma)) } href="#" className="text-blue-500">{ user?.nome }</a>
                <div>
                    <button onClick={ onEmailClick } className="border p-2 rounded-full">
                        <CiMail size={ 24 }/>
                    </button>
                    <button onClick={ onWhatsAppClick } className="border p-2 rounded-full">
                        <FaWhatsapp size={ 24 }/>
                    </button>

                </div>
            </div>
            <span>R$ { amountSpent?.toFixed(2) } consumidos</span>
        </div>
    );
}
