// src/app/hooks/useDashboardData.ts

import { useState, useEffect } from 'react';
import { useCollection } from './useCollection';
import { FireBaseDocument, OrderType, ProductBundleType, UserType } from '../utils/types';
import { Timestamp, where } from 'firebase/firestore';

interface SalesData {
    total: number;
    count: number;
}

interface DashboardData {
    sales: {
        last24h: SalesData;
        last7days: SalesData;
        last30days: SalesData;
        allTime: SalesData;
    };
    products: {
        total: number;
        active: number;
    };
    customers: {
        last30days: number;
        total: number;
    };
    isLoading: boolean;
    error: string | null;
}

export const useDashboardData = () => {
    const [data, setData] = useState<DashboardData>({
        sales: {
            last24h: { total: 0, count: 0 },
            last7days: { total: 0, count: 0 },
            last30days: { total: 0, count: 0 },
            allTime: { total: 0, count: 0 },
        },
        products: {
            total: 0,
            active: 0,
        },
        customers: {
            last30days: 0,
            total: 0,
        },
        isLoading: true,
        error: null,
    });

    const ordersCollection = useCollection<OrderType>('pedidos');
    const productsCollection = useCollection<ProductBundleType>('products');
    const usersCollection = useCollection<UserType>('usuarios');

    useEffect(() => {
        const fetchDashboardData = async() => {
            try {
                // Calcula os timestamps
                const now = new Date();
                const last24h = Timestamp.fromDate(new Date(now.getTime() - 24 * 60 * 60 * 1000));
                const last7days = Timestamp.fromDate(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
                const last30days = Timestamp.fromDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));

                // Busca contagens de pedidos por período
                const [
                    last24hCount,
                    last7daysCount,
                    last30daysCount,
                    allTimeCount,
                ] = await Promise.all([
                    ordersCollection.getCount([
                        where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
                        where('createdAt', '>=', last24h),
                    ]),
                    ordersCollection.getCount([
                        where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
                        where('createdAt', '>=', last7days),
                    ]),
                    ordersCollection.getCount([
                        where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
                        where('createdAt', '>=', last30days),
                    ]),
                    ordersCollection.getCompletedOrdersCount(),
                ]);

                // Busca valores totais de vendas por período
                const [
                    last24hOrders,
                    last7daysOrders,
                    last30daysOrders,
                    allTimeOrders,
                ] = await Promise.all([
                    ordersCollection.getDocumentsWithConstraints([
                        where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
                        where('createdAt', '>=', last24h),
                    ]),
                    ordersCollection.getDocumentsWithConstraints([
                        where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
                        where('createdAt', '>=', last7days),
                    ]),
                    ordersCollection.getDocumentsWithConstraints([
                        where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
                        where('createdAt', '>=', last30days),
                    ]),
                    ordersCollection.getCompletedOrders(),
                ]);

                // Calcula totais de vendas
                const calculateTotal = (orders: (OrderType & FireBaseDocument)[]): number => {
                    return orders.reduce((acc, order) => acc + (order.valor.soma || 0), 0);
                };

                const sales = {
                    last24h: { total: calculateTotal(last24hOrders), count: last24hCount },
                    last7days: { total: calculateTotal(last7daysOrders), count: last7daysCount },
                    last30days: { total: calculateTotal(last30daysOrders), count: last30daysCount },
                    allTime: { total: calculateTotal(allTimeOrders), count: allTimeCount },
                };

                // Busca contagens de produtos
                const [activeProductsCount, totalProductsCount] = await Promise.all([
                    productsCollection.getActiveProductsCount(),
                    productsCollection.getCount(),
                ]);

                // Busca contagens de clientes
                const [recentCustomersCount, totalCustomersCount] = await Promise.all([
                    usersCollection.getRecentDocumentsCount('createdAt', last30days.toDate()),
                    usersCollection.getCount(),
                ]);

                setData({
                    sales,
                    products: {
                        total: totalProductsCount,
                        active: activeProductsCount,
                    },
                    customers: {
                        last30days: recentCustomersCount,
                        total: totalCustomersCount,
                    },
                    isLoading: false,
                    error: null,
                });
            } catch (error) {
                setData(prev => ({
                    ...prev,
                    isLoading: false,
                    error: 'Erro ao carregar dados do dashboard',
                }));
                console.error('Erro ao buscar dados do dashboard:', error);
            }
        };

        fetchDashboardData();
    }, [ordersCollection, productsCollection, usersCollection]);

    return data;
};
