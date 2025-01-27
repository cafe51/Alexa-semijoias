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

                // Busca pedidos completados
                const completedOrders = await ordersCollection.getCompletedOrders();
                
                // Busca pedidos por período
                const [last24hOrders, last7daysOrders, last30daysOrders] = await Promise.all([
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
                ]);

                // Calcula totais de vendas
                const calculateSalesData = (orders: (OrderType & FireBaseDocument)[]): SalesData => {
                    return orders.reduce((acc, order) => ({
                        total: acc.total + (order.valor.soma || 0),
                        count: acc.count + 1,
                    }), { total: 0, count: 0 });
                };

                const sales = {
                    last24h: calculateSalesData(last24hOrders),
                    last7days: calculateSalesData(last7daysOrders),
                    last30days: calculateSalesData(last30daysOrders),
                    allTime: calculateSalesData(completedOrders),
                };

                // Busca produtos ativos e total de produtos
                const [activeProducts, allProducts] = await Promise.all([
                    productsCollection.getActiveProducts(),
                    productsCollection.getAllDocuments(),
                ]);

                // Busca clientes recentes e total de clientes
                const [recentCustomers, allCustomers] = await Promise.all([
                    usersCollection.getRecentDocuments('createdAt', last30days.toDate()),
                    usersCollection.getAllDocuments(),
                ]);

                setData({
                    sales,
                    products: {
                        total: allProducts.length,
                        active: activeProducts.length,
                    },
                    customers: {
                        last30days: recentCustomers.length,
                        total: allCustomers.length,
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
