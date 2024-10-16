// src/app/admin/pedidos/page.tsx
'use client';
// import { useState } from 'react';
// import SearchBar from '../clientes/SearchBar';
import OrderList from './OrderList';
import { useManageOrders } from '@/app/hooks/useManageOrders';

export default function DashBoardUsers() {
    const { loadingPedidos, pedidos, refreshOrders } = useManageOrders();

    return (
        <div className="p-0 ">
            <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
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