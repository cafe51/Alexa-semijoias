'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardData } from '../hooks/useDashboardData';
import LoadingIndicator from '../components/LoadingIndicator';
import { formatPrice } from '../utils/formatPrice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    description?: string;
    onClick?: () => void;
    secondaryValue?: string;
}

const StatCard = ({ title, value, description, onClick, secondaryValue }: StatCardProps) => (
    <Card 
        className={ `${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}` }
        onClick={ onClick }
    >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{ title }</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-[#C48B9F]" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-[#C48B9F]">{ value }</div>
            { secondaryValue && (
                <div className="text-sm font-medium text-gray-500">
                    { secondaryValue }
                </div>
            ) }
            { description && (
                <p className="text-xs text-gray-500 mt-1">{ description }</p>
            ) }
        </CardContent>
    </Card>
);

const PeriodStats = ({ 
    salesData, 
    title, 
    router, 
}: { 
    salesData: { total: number; count: number; }; 
    title: string;
    router: ReturnType<typeof useRouter>;
}) => (
    <div className="grid gap-4 md:grid-cols-3">
        <StatCard
            title="Total de Vendas"
            value={ formatPrice(salesData.total) }
            secondaryValue={ `${salesData.count} pedidos` }
            onClick={ () => router.push('/admin/pedidos') }
        />
        <StatCard
            title="Ticket Médio"
            value={ formatPrice(salesData.count > 0 ? salesData.total / salesData.count : 0) }
            description={ `Média por pedido em ${title.toLowerCase()}` }
        />
        <StatCard
            title="Pedidos"
            value={ salesData.count.toString() }
            description={ `Número de pedidos em ${title.toLowerCase()}` }
            onClick={ () => router.push('/admin/pedidos') }
        />
    </div>
);

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
        </div>
    );
};

export default AdminDashboard;
