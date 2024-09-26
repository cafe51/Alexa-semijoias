// OrderCard.tsx

import { useCollection } from '@/app/hooks/useCollection';
import { formatPrice } from '@/app/utils/formatPrice';
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
            <div className='flex justify-between w-full'>
                <p>{ 
                    // converter pedido.date do tipo Timestamp do firebase para um formato possível de ser renderizado e legível para o usuário
                    pedido.date.toDate().toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                } </p>
                <p>{ formatPrice(pedido?.valor.soma) } </p>
            </div>
            <div className="flex justify-between items-center gap-4 w-full">
                <div className='flex flex-col'>
                    <p>{ user.nome } </p>
                    <p><span>quantidade:</span> <span className='font-bold'>{ pedido.totalQuantity }</span></p>
                </div>
                <div className='flex flex-col'>
                    <p>{ pedido.paymentOption }</p>
                    <p>{ pedido.deliveryOption }</p>
                </div>
            </div>
        </div>
    );
}
