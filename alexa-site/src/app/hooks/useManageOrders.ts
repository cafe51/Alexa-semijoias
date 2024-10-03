import { useState, useEffect, useCallback } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, OrderType } from '@/app/utils/types';

export const useManageOrders = () => {
    const [pedidos, setPedidos] = useState<(OrderType & FireBaseDocument)[] | undefined | null>(null);
    const [loadingPedidos, setLoadingPedidos] = useState(false);
    const [refreshOrders, setRefreshOrders] = useState(false);

    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    useEffect(() => {
        async function getOrders() {
            setLoadingPedidos(true);
            const res = await getAllDocuments([
                { field: 'updatedAt', order: 'desc' },
            ]);
            setPedidos(res);
            setLoadingPedidos(false);
            console.log('pedidos', res);
        }
        getOrders();
    }, [refreshOrders, getAllDocuments]);

    const refresh = useCallback(() => setRefreshOrders(prev => !prev), []);

    return {
        pedidos,
        loadingPedidos,
        refreshOrders: refresh,
    };
};
