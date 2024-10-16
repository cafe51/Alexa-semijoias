import { useState, useEffect, useCallback } from 'react';
import { FireBaseDocument, OrderType } from '../utils/types';
import { useCollection } from './useCollection';
import { User } from 'firebase/auth';

export const useManageOrders = (user?: User | undefined) => {
    const [pedidos, setPedidos] = useState<(OrderType & FireBaseDocument)[] | undefined | null>(null);
    const [loadingPedidos, setLoadingPedidos] = useState(false);
    const [refreshOrders, setRefreshOrders] = useState(false);

    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    useEffect(() => {
        async function getOrders() {
            setLoadingPedidos(true);
            let res;
            if(user) {
                res = await getAllDocuments([
                    { field: 'userId', operator: '==', value: user?.uid }, // Filtrando pelos pedidos do usuário logado
                    { field: 'updatedAt', order: 'desc' },
                ]);
            } else {
                res = await getAllDocuments([
                    { field: 'updatedAt', order: 'desc' },
                ]);
            }

            setPedidos(res);
            setLoadingPedidos(false);
            console.log('pedidos', res);
        }
        getOrders();
    }, [refreshOrders, getAllDocuments, user?.uid]); // Adicionando user?.id como dependência

    const refresh = useCallback(() => setRefreshOrders(prev => !prev), []);

    return {
        pedidos,
        loadingPedidos,
        refreshOrders: refresh,
    };
};
