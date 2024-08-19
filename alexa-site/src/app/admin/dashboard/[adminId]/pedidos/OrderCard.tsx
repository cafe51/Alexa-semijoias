// OrderCard.tsx

import { useCollection } from '@/app/hooks/useCollection';
import formatPrice from '@/app/utils/formatPrice';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { useEffect, useState } from 'react';

// import { usePathname } from 'next/navigation';

interface OrderCardProps {
    pedido?: OrderType;
}

export default function OrderCard({ pedido }: OrderCardProps){
    const { getDocumentById } = useCollection<UserType>('usuarios');
    const [user, setUser] = useState<(UserType & FireBaseDocument) | null>(null);
    // const pathname = usePathname();

    useEffect(() => {
        async function getUser() {
            if(pedido) {
                const res = await getDocumentById(pedido.userId);
                setUser(res);
            }
        }
        getUser();
    }, []);

    if(!user || !pedido) return <p>Loading...</p>;


    return (
        <div className="flex items-end flex-col border-b py-4 gap-4 ">
            <div className="flex justify-between items-center gap-4 w-full">
                <p>{ user.nome } </p>
                <p>{ pedido.totalQuantity }</p>
                <p>{ pedido.paymentOption }</p>
                <p>{ pedido.deliveryOption }</p>


            </div>
            <span>{ formatPrice(pedido?.valor.soma) } </span>
        </div>
    );
}
