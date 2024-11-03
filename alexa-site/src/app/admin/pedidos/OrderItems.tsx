// src/components/OrderItems.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartHistoryType } from '@/app/utils/types';
import SummaryCard from '@/app/checkout/OrderSummarySection/SummaryCard';

interface OrderItemsProps {
  cartSnapShot: CartHistoryType[]
}

const OrderItems: React.FC<OrderItemsProps> = ({ cartSnapShot }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333]">
                <CardTitle className="text-lg">Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                { cartSnapShot.map((produto) => {
                    return <SummaryCard key={ produto.skuId } produto={ produto } />;
                }) }
            </CardContent>
        </Card>
    );
};

export default OrderItems;