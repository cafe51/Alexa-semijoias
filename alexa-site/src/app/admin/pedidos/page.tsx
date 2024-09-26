// AdminPage.tsx
'use client';
import { useEffect, useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, OrderType } from '@/app/utils/types';
import SearchBar from '../clientes/SearchBar';
import OrderList from './OrderList';

export default function DashBoardUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pedidos, setPedidos] = useState<(OrderType & FireBaseDocument)[] | undefined | null>(null);
    const [loadingPedidos, setLoadingPedidos] = useState(false);
    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    useEffect(() => {
        async function getOrders() {
            setLoadingPedidos(true);
            const res = await getAllDocuments();
            setPedidos(res);
            setLoadingPedidos(false);
        }
        getOrders();
    }, []);
    

    // const filteredUsers = users?.filter(user => 
    //     user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    // );

    return (
        <div className="p-0 ">
            <h1 className="text-2xl font-bold mb-4">Clientes</h1>
            <SearchBar searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } />
            {
                loadingPedidos && <p>Carregando pedidos...</p>
            }
            {
                pedidos && <OrderList pedidos={ pedidos } />
            }
            {
                !pedidos && !loadingPedidos && <p>Nenhum pedido encontrado</p>
            }
        </div>
    );
}