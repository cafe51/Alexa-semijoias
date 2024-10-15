// src/components/OrderItems.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartHistoryType } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';
import Image from 'next/image';
import blankImage from '../../../../public/blankImage.jpg';

interface OrderItemsProps {
  cartSnapShot: CartHistoryType[]
}

const OrderItems: React.FC<OrderItemsProps> = ({ cartSnapShot }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md md:col-span-2 lg:col-span-3 rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333]">
                <CardTitle className="text-lg">Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                { cartSnapShot.map(({ skuId, image, name, quantidade, value }) => {
                    const precoCheio = formatPrice(value.promotionalPrice > 0 ? (value.promotionalPrice * quantidade) : (value.price * quantidade));
                    return (
                        (
                            <div key={ skuId } className="flex items-center mb-4 pb-4 border-b last:border-b-0 gap-4 h-full ">
                                {
                                    <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                                        <Image
                                            className='rounded-lg object-cover scale-100'
                                            src={ image ? image : blankImage }
                                            alt="Foto da peça"
                                            fill
                                        />
                                    </div>
                                    // <img src={ image } alt={ name } className="w-20 h-20 object-cover rounded-md mr-4" />
                                }
                                <div className="flex flex-col justify-between flex-1 h-20">
                                    <h3 className="font-semibold overflow-hidden">{ name }</h3>
                                    <p className='text-sm text-gray-500'>
                                        <span className='font-bold'>{ quantidade }</span> { quantidade > 1 ? 'unidades' : 'unidade' } por <span className="font-bold">{ precoCheio }</span>
                                    </p>
                                </div>
                            </div>
                        )
                    );
                }) }
            </CardContent>
        </Card>
    );
};

export default OrderItems;