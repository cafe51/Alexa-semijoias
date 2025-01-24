import { useState, useEffect } from 'react';
import { useCollection } from './useCollection';
import { OrderType, ProductBundleType, UserType } from '../utils/types';
import { Timestamp } from 'firebase/firestore';

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

                // Busca todos os dados
                const [allOrders, products, allCustomers] = await Promise.all([
                    ordersCollection.getAllDocuments(),
                    productsCollection.getAllDocuments(),
                    usersCollection.getAllDocuments(),
                ]);

                // Processa os pedidos por período
                const sales = {
                    last24h: { total: 0, count: 0 },
                    last7days: { total: 0, count: 0 },
                    last30days: { total: 0, count: 0 },
                    allTime: { total: 0, count: 0 },
                };

                allOrders.forEach(order => {
                    const orderDate = (order.createdAt as Timestamp).toDate();
                    const orderTotal = order.valor.soma || 0;

                    // Atualiza totais para todos os períodos
                    sales.allTime.total += orderTotal;
                    sales.allTime.count++;

                    if (orderDate >= last30days.toDate()) {
                        sales.last30days.total += orderTotal;
                        sales.last30days.count++;

                        if (orderDate >= last7days.toDate()) {
                            sales.last7days.total += orderTotal;
                            sales.last7days.count++;

                            if (orderDate >= last24h.toDate()) {
                                sales.last24h.total += orderTotal;
                                sales.last24h.count++;
                            }
                        }
                    }
                });

                // Processa produtos
                const activeProducts = products.filter(product => product.showProduct && product.estoqueTotal > 0);

                // Processa clientes
                const recentCustomers = allCustomers.filter(
                    customer => (customer.createdAt as Timestamp).toDate() >= last30days.toDate(),
                );

                setData({
                    sales,
                    products: {
                        total: products.length,
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
