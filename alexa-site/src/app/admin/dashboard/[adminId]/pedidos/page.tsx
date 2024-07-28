// AdminPage.tsx
'use client';
import { useEffect, useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { OrderType } from '@/app/utils/types';
import SearchBar from '../clientes/SearchBar';
import OrderList from './OrderList';
import { DocumentData, WithFieldValue } from 'firebase/firestore';

export default function DashBoardUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pedidos, setPedidos] = useState<(OrderType & WithFieldValue<DocumentData>)[] | undefined | null>(null);
    const { getAllDocuments } = useCollection<OrderType>('pedidos');

    useEffect(() => {
        async function getOrders() {
            const res = await getAllDocuments();
            setPedidos(res);
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
            <OrderList pedidos={ pedidos } />
        </div>
    );
}