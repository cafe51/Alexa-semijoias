// src/components/OrderStatus.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OrderType } from '@/app/utils/types';
import { statusColors } from '@/app/utils/statusColors';
import DeliveryTimeSection from './DeliveryTimeSection';
import Link from 'next/link';

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
                            <Badge className='text-white bg-green-500'>Pagamento Aprovado</Badge>
                        }
                        <Badge className={`${statusColors[order.status]} text-white`}>
                            {order.status}
                        </Badge>

                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
                {
                    <DeliveryTimeSection deliveryDays={order.deliveryOption.deliveryTime} orderCreationDate={order.createdAt.toDate()} />
                }
                {
                    order.status === 'pedido enviado' && order.tracknumber &&
                    <div className="flex flex-col gap-2 mt-4 p-4 bg-gray-50 rounded border border-gray-200">
                        <p className="font-semibold text-gray-700">Código de Rastreio:</p>
                        <p className="text-lg font-bold text-[#C48B9F] select-all">{order.tracknumber}</p>

                        {(order.deliveryOption?.name?.toLowerCase().includes('pac') || order.deliveryOption?.name?.toLowerCase().includes('sedex')) && (
                            <Link
                                href={`https://linketrack.com/track?codigo=${order.tracknumber}`}
                                target="_blank"
                                className="mt-2 text-center bg-[#333] text-white py-2 px-4 rounded hover:bg-black transition-colors"
                            >
                                Rastrear Pedido
                            </Link>
                        )}
                        {/* Se for entrega local (não tem tracknumber ou tem flag específica, mas aqui estamos assumindo que só aparece se tiver tracknumber) */}
                    </div>
                }
                {
                    (order.status === 'aguardando pagamento' || order.status === 'preparando para o envio') &&
                    <div>
                        <p className='text-center text-lg'>Informações referentes ao envio serão exibidas aqui quando o pedido for enviado</p>
                    </div>
                }
                {
                    order.status === 'entregue' &&
                    <div>
                        <p className='text-center text-lg'>
                            Não recebeu o pedido? Entre em contato por
                            {' '}
                            <Link href='https://wa.me/17981650632' target="_blank" className='text-[#C48B9F] hover:text-white'>
                                aqui
                            </Link>
                        </p>
                    </div>
                }
                {
                    order.status === 'cancelado' &&
                    <div>
                        <p className='text-center text-lg'>
                            Algum problema com  seu pedido? Entre em contato por
                            {' '}
                            <Link href='https://wa.me/17981650632' target="_blank" className='text-[#C48B9F] hover:text-white'>
                                aqui
                            </Link>
                        </p>
                    </div>
                }
            </CardContent>
        </Card>
    );
};

export default OrderStatus;