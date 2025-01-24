'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CardProps {
    title: string;
    value: string;
    description: string;
    onClick: () => void;
}

const Card = ({ title, value, description, onClick }: CardProps) => (
    <div 
        className="bg-white p-6 rounded-lg shadow-md border border-[#F8C3D3] cursor-pointer hover:shadow-lg transition-shadow"
        onClick={ onClick }
    >
        <h3 className="text-lg font-semibold text-[#333333] mb-2">{ title }</h3>
        <p className="text-2xl font-bold text-[#C48B9F] mb-2">{ value }</p>
        <p className="text-sm text-gray-600">{ description }</p>
    </div>
);

const AdminDashboard = () => {
    const router = useRouter();

    const cards = [
        {
            title: 'Vendas Recentes',
            value: 'R$ 15.750,00',
            description: 'Total de vendas nos últimos 7 dias',
            onClick: () => router.push('/admin/vendas'),
        },
        {
            title: 'Produtos',
            value: '157',
            description: 'Total de produtos cadastrados',
            onClick: () => router.push('/admin/produtos'),
        },
        {
            title: 'Clientes',
            value: '89',
            description: 'Clientes cadastrados no último mês',
            onClick: () => router.push('/admin/clientes'),
        },
    ];

    return (
        <>
            <h2 className="text-2xl font-bold text-[#333333] mb-6">Painel de Controle</h2>
            <div className="grid grid-cols-1 gap-6 max-w-xl mx-auto">
                { cards.map((card, index) => (
                    <Card 
                        key={ index } 
                        title={ card.title }
                        value={ card.value }
                        description={ card.description }
                        onClick={ card.onClick }
                    />
                )) }
            </div>
        </>
    );
};

export default AdminDashboard;
