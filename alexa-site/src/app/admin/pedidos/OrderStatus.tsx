// src/components/OrderStatus.tsx
import React from 'react';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderType } from '@/app/utils/types';
import { statusColors } from '@/app/utils/statusColors';

interface OrderStatusProps {
  order: OrderType;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md md:col-span-2 lg:col-span-3">
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
                <div className="flex items-center text-sm mb-2">
                    <Package className="mr-2 h-4 w-4" />
          Estimativa de entrega: 5-7 dias úteis
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#D4AF37] h-2.5 rounded-full" style={ { width: '45%' } }></div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OrderStatus;