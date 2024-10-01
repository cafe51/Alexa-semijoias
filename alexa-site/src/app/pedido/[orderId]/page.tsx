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
    const [loadingState, setLoadingState] = useState(true);

    useEffect(() => {
        setLoadingState(true);
        console.log('pedidoState', pedidoState);
        setPedidoState(pedidoDocumentSnapShot);
        setLoadingState(false);

    } , [pedidoDocumentSnapShot]);

    useEffect(() => {
        async function fetchUser() {
            setLoadingState(true);

            if(pedidoState && pedidoState.exist) {
                const res = await getUserById(pedidoState.userId);
                setUser(res);
            }
            setLoadingState(false);

        }
        fetchUser();
    }, [pedidoState]);

    if(loadingState) return <p>Carregando...</p>;
    if(!pedidoState || !user) return <p>Pedido não encontrado</p>;

    return (
        <OrderDetails pedido={ pedidoState } user={ user }/>
    );
}