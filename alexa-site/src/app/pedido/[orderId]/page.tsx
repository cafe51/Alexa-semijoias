// src/app/pedidos/[orderId]/page.tsx
'use client';
import OrderDetails from '@/app/admin/pedidos/OrderDetails';
import { useCollection } from '@/app/hooks/useCollection';
import { useSnapshotById } from '@/app/hooks/useSnapshotById';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { useEffect, useState } from 'react';

export default function OrderPage({ params: { orderId } }: { params: { orderId: string} }) {
    const { getDocumentById: getUserById } = useCollection<UserType>('usuarios');
    const [user, setUser] = useState<(UserType & FireBaseDocument) | null>(null);
    const { document: pedidoDocumentSnapShot } = useSnapshotById<OrderType>('pedidos', orderId);
    const [pedidoState, setPedidoState] = useState(pedidoDocumentSnapShot);

    useEffect(() => {
        console.log('pedidoState', pedidoState);
        setPedidoState(pedidoDocumentSnapShot);
    } , [pedidoDocumentSnapShot]);

    useEffect(() => {
        async function fetchUser() {
            if(pedidoState) {
                const res = await getUserById(pedidoState.userId);
                setUser(res);
            }
        }
        fetchUser();
    }, [pedidoState]);

    if(!pedidoState) return <p>Carregando...</p>;
    if(!user) return <p>Carregando...</p>;

    return (
        <OrderDetails pedido={ pedidoState } user={ user }/>
    );
}