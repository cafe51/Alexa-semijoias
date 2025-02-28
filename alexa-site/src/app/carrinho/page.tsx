// app/carrinho/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../hooks/useUserInfo';
import CartItem from './CartItem/CartItem';
import CartHeader from './CartHeader';
import { ArrowLeft,  ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import OrderSummary from './OrderSummary';
import ContinueShoppingButton from './ContinueShoppingButton';
import LoadingIndicator from '../components/LoadingIndicator';
import { COUPONREVENDEDORAFIRSTCODE, COUPONREVENDEDORAVIP } from '../utils/constants';
import CouponSection from '../checkout/CouponSection/CouponSection';

interface CartItem {
  skuId: string;
  quantidade: number;
  value: {
    promotionalPrice?: number;
    price: number;
  };
}

export default function Carrinho() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Adiciona uma animação suave
        });
        setLoadingComponent(false);
    }, []);

    const [shipping, setShipping] = useState<number | null>(null);
    const [cartPrice, setCartPrice] = useState(0);
    const [loadingComponent, setLoadingComponent] = useState(true);
    const { carrinho } = useUserInfo();
    const router = useRouter();
    

    // Estados para o cupom
    const [ couponDiscount, setCouponDiscount ] = useState<number | 'freteGratis'>(0);
    const [ couponCode, setCouponCode ] = useState<string>('');
    const [ carrinhoState, setCarrinhoState ] = useState<ProductCartType[] | null>(null);


    useEffect(() => {
        setCarrinhoState(carrinho);
        console.log('definiu carrinhoState');
    }, [carrinho]);

    useEffect(() => {
        const removePromotionalPriceCondition = couponCode.trim() === COUPONREVENDEDORAFIRSTCODE || couponCode.trim() === COUPONREVENDEDORAVIP;
        if(removePromotionalPriceCondition) {
            if(!carrinho) return;
            console.log('map cart revendedora coupon');
            setCarrinhoState(carrinho.map((item) => ({
                ...item,
                value: {
                    ...item.value,
                    promotionalPrice: 0,
                },
            })));
        } else {
            if(!carrinho) return;
            console.log('map cart normal coupon');
            setCarrinhoState(carrinho);
        }
        
    }, [couponCode, carrinho]);

    useEffect(() => {
        if (carrinhoState) {
            setCartPrice(
                Number(carrinhoState
                    ?.map((items) => (Number(items.quantidade) * (items.value.promotionalPrice ? items.value.promotionalPrice : items.value.price)))
                    .reduce((a, b) => a + b, 0)),
            );
        }
    }, [carrinhoState]);

    const selectShipping = (price: string) => {
        setShipping(Number(price)); // Parse para número
    };

    if(loadingComponent) return (
        <section className='flex flex-col items-center justify-center h-3/6'>
            <LoadingIndicator />
        </section>
    );


    if (!carrinho || carrinho.length === 0) {
        return (
            <div className="h-screen">
                <div className='flex flex-col h-1/3 items-center justify-around '>
                    <p className="text-xl md:text-2xl lg:text-3xl">Seu carrinho está vazio.</p>
                    <ShoppingCart className="h-12 w-12 md:h-20 md:w-20 lg:h-24 lg:w-24" color='#C48B9F'/>
                    <Button
                        variant="outline"
                        className=" text-[#C48B9F] border-[#C48B9F] hover:bg-[#C48B9F] hover:text-white text-base w-48 md:text-lg lg:text-xl md:w-52 lg:w-60 md:p-6"
                        onClick={ () => {
                            setLoadingComponent(true);
                            router.push('/');
                        } }
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para a loja
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-[#333333] px-4 py-8 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <CartHeader cartItems={ carrinho } router={ router }/>

                <div className="flex flex-col lg:flex-row gap-8">
                    <CartItemList cartItems={ carrinho } />
                    <div className='flex flex-col gap-4'>
                        <CouponSection 
                            carrinho={ carrinhoState }
                            fetchDeliveryOptions={ () => {} }
                            resetSelectedDeliveryOption={ () => () => {} }
                            hiddenPaymentSection={ () => {} }
                            setCouponDiscount={ (discount: number | 'freteGratis') => setCouponDiscount(discount) }
                            couponDiscount={ couponDiscount }
                            setCouponCode={ (code: string) => setCouponCode(code) }
                        />
                        <OrderSummary 
                            carrinho={ carrinho }
                            subtotal={ cartPrice }
                            shipping={ shipping }
                            onSelectShipping={ selectShipping }
                            onCheckout={ () => router.push('/checkout') }
                            couponDiscount={ couponDiscount }
                        />
                    </div>
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
