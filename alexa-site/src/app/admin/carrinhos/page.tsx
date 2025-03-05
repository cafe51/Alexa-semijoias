'use client';
// components/AdminCartsList.tsx

import React, { useState, useEffect } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import CartGroupCard from './CartGroupCard';
import CartDetailModal from './CartDetailModal';
import { CartInfoType } from '@/app/utils/types';

const AdminCartsList: React.FC = () => {
    const { getAllDocuments } = useCollection<CartInfoType>('carrinhos');
    const [cartsData, setCartsData] = useState<{ [userId: string]: CartInfoType[] }>({});
    const [loading, setLoading] = useState(true);
    const [selectedCart, setSelectedCart] = useState<{ userId: string; items: CartInfoType[] } | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchCarts = async() => {
            try {
                const cartItems = await getAllDocuments();
                // Agrupa os itens por userId
                const grouped: { [userId: string]: CartInfoType[] } = {};
                cartItems.forEach(item => {
                    if (!grouped[item.userId]) grouped[item.userId] = [];
                    grouped[item.userId].push(item);
                });
                setCartsData(grouped);
            } catch (error) {
                console.error('Erro ao buscar carrinhos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCarts();
    }, [getAllDocuments]);

    const handleViewDetails = (userId: string, items: CartInfoType[]) => {
        setSelectedCart({ userId, items });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedCart(null);
    };

    if (loading) {
        return <p>Carregando carrinhos...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Lista de Carrinhos</h1>
            { Object.keys(cartsData).length === 0 ? (
                <p>Nenhum carrinho encontrado.</p>
            ) : (
                Object.entries(cartsData).map(([userId, items]) => (
                    <CartGroupCard
                        key={ userId }
                        userId={ userId }
                        items={ items }
                        onViewDetails={ handleViewDetails }
                    />
                ))
            ) }
            { selectedCart && (
                <CartDetailModal
                    userId={ selectedCart.userId }
                    items={ selectedCart.items }
                    isOpen={ modalOpen }
                    onClose={ closeModal }
                />
            ) }
        </div>
    );
};

export default AdminCartsList;
