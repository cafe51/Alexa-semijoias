'use client';
// src/components/ResponsiveOrderDetails.tsx
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Order } from '../types/order';
import { mockOrder, menuSections } from '../data/mockOrder';
import Header from './Header';
import OrderStatus from './OrderStatus';
import CustomerInfo from './CustomerInfo';
import DeliveryAddress from './DeliveryAddress';
import PaymentSummary from './PaymentSummary';
import OrderItems from './OrderItems';
import OrderActions from './OrderActions';
import Footer from './Footer';

export default function ResponsiveOrderDetails() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [cartItems, setCartItems] = useState(0);
    const [order, setOrder] = useState<Order>(mockOrder);

    useEffect(() => {
        const handleScroll = () => {
            const position = window.pageYOffset;
            setScrollPosition(position);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#333333]">
            <Header scrollPosition={ scrollPosition } cartItems={ cartItems } menuSections={ menuSections } />

            <main className="pt-[100px] p-4 max-w-6xl mx-auto">
                <div className="flex items-center mb-6">
                    <Button variant="ghost" size="icon" className="mr-2">
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <h1 className="text-2xl font-semibold">Detalhes do Pedido { order.id }</h1>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <OrderStatus order={ order } />
                    <CustomerInfo customer={ order.customer } />
                    <DeliveryAddress address={ order.address } />
                    <PaymentSummary payment={ order.payment } />
                    <OrderItems items={ order.items } />
                </div>

                <OrderActions />

                <Footer />
            </main>
        </div>
    );
}