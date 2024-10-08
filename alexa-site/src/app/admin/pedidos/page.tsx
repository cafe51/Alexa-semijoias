// AdminPage.tsx
'use client';
// import { useState } from 'react';
// import SearchBar from '../clientes/SearchBar';
import OrderList from './OrderList';
import { useManageOrders } from '@/app/hooks/useManageOrders';

export default function DashBoardUsers() {
    // const [searchQuery, setSearchQuery] = useState('');
    const { loadingPedidos, pedidos, refreshOrders } = useManageOrders();

    // const filteredUsers = users?.filter(user => 
    //     user.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchQuery.toLowerCase()),
    // );

    return (
        <div className="p-0 ">
            <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
            { /* <SearchBar searchQuery={ searchQuery } setSearchQuery={ setSearchQuery } /> */ }
            {
                loadingPedidos && <p>Carregando pedidos...</p>
            }
            {
                pedidos && <OrderList pedidos={ pedidos } handleRefreshProductList={ refreshOrders }/>
            }
            {
                !pedidos && !loadingPedidos && <p>Nenhum pedido encontrado</p>
            }
        </div>
    );
}