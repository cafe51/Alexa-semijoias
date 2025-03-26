// src/app/carrinho/OrderSummary.tsx
import { formatPrice } from '../utils/formatPrice';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import ShippingCalculator from './ShippingCalculator';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackPixelEvent } from '../utils/metaPixel';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import { useMemo } from 'react';
import { sendGTMEvent } from '../utils/analytics';

export default function OrderSummary({ 
    subtotal, 
    shipping, 
    onSelectShipping, 
    onCheckout,
    carrinho,
    couponDiscount,
}: { 
    subtotal: number;
    shipping: number | null;
    onSelectShipping: (optionPrice: string) => void;
    onCheckout: () => void;
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[];
    couponDiscount: number | 'freteGratis';
}) {
    const totalItems = useMemo(() => {
        if (!carrinho || carrinho.length === 0) return 0;
        return carrinho.map((items) => Number(items.quantidade)).reduce((a, b) => a + b, 0);
    }, [carrinho]);

    const couponDiscountIsFreeShipping = useMemo(() => {
        return !!couponDiscount && couponDiscount === 'freteGratis'; 
    }, [couponDiscount]);

    const couponDiscountValue = useMemo(() => {
        return !couponDiscountIsFreeShipping && !!couponDiscount && couponDiscount !== 'freteGratis' ? couponDiscount : 0;
    }, [couponDiscount, couponDiscountIsFreeShipping]);

    const totalValue = useMemo(() => {
        return (
            (subtotal - (couponDiscountIsFreeShipping ? 0 : couponDiscountValue)) + 
            (couponDiscountIsFreeShipping ? 0 : (shipping || 0))
        );
    }, [subtotal, shipping, couponDiscountIsFreeShipping, couponDiscountValue]);

    return (
        <div className="w-full md:max-w-2xl md:mx-auto flex-grow">
            <Card className="w-full shadow-md shadow-[#C48B9F]">
                <CardContent className="p-6 md:p-8">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6">
                        Resumo do Pedido
                    </h2>
                    <div className="space-y-2 md:space-y-4 mb-4 md:mb-6">
                        <div className="flex justify-between">
                            <span className="text-base md:text-lg lg:text-xl">Subtotal:</span>
                            <span className="text-base md:text-lg lg:text-xl">{ formatPrice(subtotal) }</span>
                        </div>

                        { !couponDiscountIsFreeShipping && !!couponDiscount && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="md:text-xl font-bold">Desconto:</span>
                                <span className="font-medium md:text-xl">- { formatPrice(couponDiscountValue) }</span>
                            </div>
                        ) }

                        { couponDiscountIsFreeShipping && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="md:text-xl font-bold">Desconto:</span>
                                <span className="font-medium md:text-xl">Frete Grátis</span>
                            </div>
                        ) }

                        { !couponDiscountIsFreeShipping && (
                            <div className="flex justify-between items-center">
                                <span className="text-base md:text-lg lg:text-xl">Frete:</span>
                                <ShippingCalculator 
                                    onSelectShipping={ onSelectShipping } 
                                    selectedShipping={ shipping } 
                                    cartPrice={ subtotal }
                                    couponDiscount={ couponDiscount }
                                />
                            </div>
                        ) }
                    </div>
                    <Separator className="my-4 md:my-6" />
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <span className="text-lg md:text-xl lg:text-2xl font-semibold">Total:</span>
                        <span className="text-lg md:text-xl lg:text-2xl font-semibold">{ formatPrice(totalValue) }</span>
                    </div>
                    <div className="flex flex-col text-end w-full">
                        <p className="text-sm md:text-base lg:text-lg">
                            Em até 6x <span className="font-bold">{ formatPrice(totalValue / 6) }</span> sem juros
                        </p>
                    </div>
                    <Button 
                        className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white text-base md:text-lg lg:text-xl py-2 md:py-6 mt-4 md:mt-6"
                        onClick={ () => {
                            trackPixelEvent('InitiateCheckout', {
                                currency: 'BRL',
                                value: totalValue,
                                num_items: totalItems,
                                content_type: 'product',
                                content_ids: carrinho.map(item => item.skuId),
                                contents: carrinho.map(item => ({
                                    id: item.skuId,
                                    quantity: item.quantidade,
                                })),
                            });

                            // 1. Garante que há itens antes de prosseguir e enviar o evento
                            if (carrinho && carrinho.length > 0) {

                                // 2. Envia o evento begin_checkout (mesmos dados do view_cart)
                                sendGTMEvent('begin_checkout', {
                                    ecommerce: {
                                        currency: 'BRL',
                                        value: totalValue, // Reutiliza o valor total calculado
                                        items: carrinho.map((item) => {
                                            const productPrice = item.value.promotionalPrice || item.value.price;
                                            const itemSection = item.subsections && item.subsections.length > 0 ? item.subsections[0].split(':')[0] : item.sections[0];
                                            const itemSubSection = item.subsections && item.subsections.length > 0 ? item.subsections[0].split(':')[1] : null;
                                            return ({
                                                item_id: item.skuId,
                                                item_name: item.name,
                                                item_brand: 'Alexa Semijoias',
                                                item_category: itemSection,
                                                item_category2: itemSubSection,
    
                                                // item_variant: item.variant,
                                                price: productPrice,
                                                quantity: item.quantidade,
                                            });
                                        }),
                                    },
                                });
                            } else {
                                console.log('Carrinho vazio, não pode iniciar checkout.');
                            }

                            onCheckout();
                        } }
                    >
                        <ShoppingBag className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                        Finalizar Compra
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
