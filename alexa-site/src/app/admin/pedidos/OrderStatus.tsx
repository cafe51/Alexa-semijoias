// src/components/OrderStatus.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderType } from '@/app/utils/types';
import { statusColors } from '@/app/utils/statusColors';
import DeliveryTimeSection from './DeliveryTimeSection';

interface OrderStatusProps {
  order: OrderType;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333]">
                <CardTitle className="text-lg flex flex-col gap-2 justify-between w-full  ">

          Status do Pedido
                    <div className='flex text-center gap-2 flex-shrink-0 '>
                        {
                            order.status !== 'cancelado' && order.status !== 'aguardando pagamento' &&
                            <Badge className= 'text-white bg-green-500'>Pagamento Aprovado</Badge>
                        }
                        <Badge className={ `${statusColors[order.status]} text-white` }>
                            { order.status }
                        </Badge>

                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
                <DeliveryTimeSection deliveryDays={ order.deliveryOption.deliveryTime } orderCreationDate={ order.createdAt.toDate() } />
            </CardContent>
        </Card>
    );
};

export default OrderStatus;