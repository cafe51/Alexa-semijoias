// app/carrinho/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useUserInfo } from '../hooks/useUserInfo';
import CartItem from './CartItem3';
import CartHeader from './CartHeader';
import { ArrowLeft,  ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import OrderSummary from './OrderSummary';
import ContinueShoppingButton from './ContinueShoppingButton';

const shippingOptions = [
    { id: 'pac', name: 'PAC', price: 15.90, days: 7 },
    { id: 'sedex', name: 'Sedex', price: 25.50, days: 3 },
];

interface CartItem {
  skuId: string;
  quantidade: number;
  value: {
    promotionalPrice?: number;
    price: number;
  };
}

export default function Carrinho() {
    const [shipping, setShipping] = useState<string | null>(null);
    const { carrinho } = useUserInfo();
    const router = useRouter();

    const selectShipping = (optionId: string) => {
        setShipping(optionId);
    };

    const subtotal = useMemo(() => {
        if(!carrinho || carrinho.length === 0) return 0;
        const subtotal = carrinho.map((item) => (Number(item.value.promotionalPrice || item.value.price) * item.quantidade)).reduce((a, b) => a + b, 0);
        return subtotal;
    }, [carrinho]);

    const total = useMemo(() => {
        const shippingPrice = shippingOptions.find((shippingOption) => shipping === shippingOption.id)?.price || 0;
        console.log('shipping', shippingPrice);
        return subtotal + shippingPrice;
    }, [subtotal, shipping]);

    if (!carrinho || carrinho.length === 0) {
        return (
            <div className="h-screen">
                <div className='flex flex-col h-1/3 items-center justify-around '>
                    <p className="text-xl md:text-2xl lg:text-3xl">Seu carrinho está vazio.</p>
                    <ShoppingCart className="h-12 w-12 md:h-20 md:w-20 lg:h-24 lg:w-24" color='#C48B9F'/>
                    <Button
                        variant="outline"
                        className=" text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white text-base w-48 md:text-lg lg:text-xl md:w-52 lg:w-60 md:p-6"
                        onClick={ () => router.push('/') }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para a loja
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-[#333333] pb-8 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <CartHeader cartItems={ carrinho } router={ router }/>

                <div className="flex flex-col lg:flex-row gap-8">
                    <CartItemList cartItems={ carrinho } />
                    <OrderSummary 
                        subtotal={ subtotal }
                        shipping={ shipping }
                        total={ total }
                        onSelectShipping={ selectShipping }
                        onCheckout={ () => router.push('/checkout') }
                        shippingOptions={ shippingOptions }
                    />
                </div>

                <ContinueShoppingButton className="mt-8 sm:hidden" router={ router }/>
            </div>
        </div>
    );
}

function CartItemList({ cartItems }: { cartItems: (ProductCartType & FireBaseDocument)[] | ProductCartType[] }) {
    return (
        <section className='flex-grow'>
            { cartItems.map((cartItem) => (
                cartItem.quantidade > 0 && (
                    <CartItem key={ cartItem.skuId } cartItem={ cartItem } />
                )
            )) }
        </section>
    );
}

