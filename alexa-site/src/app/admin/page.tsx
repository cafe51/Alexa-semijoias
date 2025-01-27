'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '../hooks/useDashboardData';
import LoadingIndicator from '../components/LoadingIndicator';
import { formatPrice } from '../utils/formatPrice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChangeDataBaseButton from './components/ChangeDataBaseButton';
import SendEmailsTest from './components/SendEmailsTest';
import StatCard from './components/StatCard';
import PeriodStats from './components/PeriodStats';

const AdminDashboard = () => {
    const router = useRouter();
    const { sales, products, customers, isLoading, error } = useDashboardData();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingIndicator />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-center">
                { error }
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[#333333]">Painel de Controle</h2>
            
            { /* Resumo Geral */ }
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard
                    title="Produtos Ativos"
                    value={ products.active.toString() }
                    secondaryValue={ `${products.total} produtos no total` }
                    onClick={ () => router.push('/admin/produtos') }
                />
                <StatCard
                    title="Clientes"
                    value={ customers.total.toString() }
                    secondaryValue={ `${customers.last30days} novos nos últimos 30 dias` }
                    onClick={ () => router.push('/admin/clientes') }
                />
                <StatCard
                    title="Total Histórico"
                    value={ formatPrice(sales.allTime.total) }
                    secondaryValue={ `${sales.allTime.count} pedidos no total` }
                    onClick={ () => router.push('/admin/pedidos') }
                />
            </div>

            { /* Tabs com períodos */ }
            <Tabs defaultValue="24h" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="24h">Últimas 24h</TabsTrigger>
                    <TabsTrigger value="7d">7 Dias</TabsTrigger>
                    <TabsTrigger value="30d">30 Dias</TabsTrigger>
                </TabsList>
                <TabsContent value="24h" className="space-y-4">
                    <PeriodStats salesData={ sales.last24h } title="24 horas" router={ router } />
                </TabsContent>
                <TabsContent value="7d" className="space-y-4">
                    <PeriodStats salesData={ sales.last7days } title="7 dias" router={ router } />
                </TabsContent>
                <TabsContent value="30d" className="space-y-4">
                    <PeriodStats salesData={ sales.last30days } title="30 dias" router={ router } />
                </TabsContent>
            </Tabs>

            {
                process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true'
            &&
            <div className='flex flex-col gap-4 border border-gray-300 p-4 rounded-lg'>
                <h1>Área do desenvolvedor</h1>
                <ChangeDataBaseButton />
                <SendEmailsTest />
            </div>
            }
        </div>
    );
};

export default AdminDashboard;
