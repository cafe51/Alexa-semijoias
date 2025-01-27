import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import StatCard from './StatCard';
import { formatPrice } from '@/app/utils/formatPrice';

export default function PeriodStats({ 
    salesData, 
    title, 
    router, 
}: { 
    salesData: { total: number; count: number; }; 
    title: string;
    router: AppRouterInstance;
}) {
    return (
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
}