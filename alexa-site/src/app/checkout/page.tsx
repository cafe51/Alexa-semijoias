// app/checkout/page.tsx
'use client';
import { useCheckoutState } from '../hooks/useCheckoutState';
import { useUserInfo } from '../hooks/useUserInfo';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MetaConversionsService } from '@/app/utils/meta-conversions/service';
import AccountSection from './AccountSection/AccountSection';
import AddressSection from './AddressSection/AddressSection';
import DeliveryPriceSection from './DeliveryPriceSection/DeliveryPriceSection';
import OrderSummarySection from './OrderSummarySection/OrderSummarySection';
import PaymentSectionWithMercadoPago from './PaymentSection/PaymentSectionWithMercadoPago';
import { useWindowSize } from '../hooks/useWindowSize';
import PriceSummarySection from './OrderSummarySection/PriceSummarySection';
import Link from 'next/link';
import { ProductCartType } from '../utils/types';
import SummaryCard from './OrderSummarySection/SummaryCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { useCollection } from '../hooks/useCollection';
import CouponSection from './CouponSection/CouponSection';
import { COUPONREVENDEDORAFIRSTCODE, COUPONREVENDEDORAVIP } from '../utils/constants';

export default function Checkout() {
    const router = useRouter();
    const { userInfo, carrinho } = useUserInfo();
    const { deleteDocumentsByUserId: deleteCartItemsFromDb } = useCollection<ProductCartType>('carrinhos');
    const [ loadingScreen, setLoadingScreen ] = useState(true);
    const [cartPrice, setCartPrice] = useState(0);
    const [isCartLoading, setIsCartLoading] = useState(true);
    const [showPaymentSection, setShowPaymentSection] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | undefined>(undefined);
    const [showPaymentFailSection, setShowPaymentFailSection] = useState<boolean | string>(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isPaymentFinished, setIsPaymentFinished] = useState(false);
    const { screenSize } = useWindowSize();

    // Estados para o cupom
    const [ couponDiscount, setCouponDiscount ] = useState<number | 'freteGratis'>(0);
    const [ couponCode, setCouponCode ] = useState<string>('');
    const [ carrinhoState, setCarrinhoState ] = useState<ProductCartType[] | null>(null);

    // Ref para guardar uma cópia do carrinho no momento do pagamento finalizado
    const cartSnapshotRef = useRef<ProductCartType[] | null>(null);

    const {
        state,
        handleShowLoginSection,
        handleAddressChange,
        handleEditingAddressMode,
        handleSelectedDeliveryOption,
        deliveryOptions,
        handleShowFullOrderSummary,
        fetchDeliveryOptions,
    } = useCheckoutState();

    useEffect(() => {
        setCarrinhoState(carrinho);
        console.log('definiu carrinhoState');
    }, [carrinho]);

    useEffect(() => {
        const removePromotionalPriceCondition = (
            couponCode.trim() === COUPONREVENDEDORAFIRSTCODE
            ||couponCode.trim() === COUPONREVENDEDORAVIP
            || couponCode.trim() === 'MARLI15'
            || couponCode.trim() === 'ALE15'
            || couponCode.trim() === 'DUDA15'
            || couponCode.trim() === 'DAIANE15'
        );
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
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });

        // Envia evento de início de checkout para a API de Conversões da Meta
        if (carrinho && carrinho.length > 0) {
            MetaConversionsService.getInstance().sendInitiateCheckout({
                cart: carrinho,
                url: window.location.href,
            }).catch(error => {
                console.error('Failed to send InitiateCheckout event to Meta Conversions API:', error);
            });
        }
    }, [carrinho]);

    // Ao finalizar o pagamento, salva um snapshot do carrinho
    useEffect(() => {
        if (isPaymentFinished && carrinho) {
            cartSnapshotRef.current = [...carrinho];
        }
    }, [isPaymentFinished, carrinho]);

    useEffect(() => {
        if (isPaymentFinished && userInfo) {
            deleteCartItemsFromDb(userInfo.userId);
        }
    }, [isPaymentFinished, userInfo, deleteCartItemsFromDb]);

    useEffect(() => {
        if (!carrinho || carrinho.length < 1) {
            // Simulate fetching cart data or some async operation
            setLoadingScreen(true);
            setIsCartLoading(true);
            setTimeout(() => {
                setIsCartLoading(false);
            }, 8000); 
        } else {
            setIsCartLoading(false);
        }
    }, [carrinho]);

    useEffect(() => {
        if (!isCartLoading && !isProcessingPayment) {
            if (carrinho && carrinho.length > 0) {
                setLoadingScreen(false);
            } else {
                router.push('/carrinho');
            }
        }
    }, [carrinho, isCartLoading, router, isProcessingPayment]);

    useEffect(() => {
        if (!userInfo?.address) {
            handleEditingAddressMode(true);
        } else {
            handleEditingAddressMode(false);
        }
    }, [userInfo?.address]);

    useEffect(() => {
        if (carrinhoState) {
            setCartPrice(
                Number(carrinhoState
                    ?.map((items) => (Number(items.quantidade) * (items.value.promotionalPrice ? items.value.promotionalPrice : items.value.price)))
                    .reduce((a, b) => a + b, 0)),
            );
        }
    }, [carrinhoState]);


    if(loadingScreen) return (
        <section className='flex flex-col items-center justify-center h-3/6'>
            <LoadingIndicator />
        </section>
    );

    
    return (
        <main className="container mx-auto px-4 min-h-[60vh] py-8">
            { screenSize === 'mobile' ? (
                // Layout Mobile
                <div className="space-y-4">
                    <OrderSummarySection 
                        carrinho={ carrinhoState } 
                        cartPrice={ cartPrice }
                        couponDiscount={ couponDiscount }
                        handleShowFullOrderSummary={ handleShowFullOrderSummary }
                        state={ state }
                    />
                    { /* Seção de cupom */ }
                    <CouponSection 
                        carrinho={ carrinhoState }
                        fetchDeliveryOptions={ fetchDeliveryOptions }
                        resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) }
                        hiddenPaymentSection={ () => setShowPaymentSection(false) }
                        setCouponDiscount={ (discount: number | 'freteGratis') => setCouponDiscount(discount) }
                        couponDiscount={ couponDiscount }
                        setCouponCode={ (code: string) => setCouponCode(code) }
                    />
                    <AccountSection 
                        handleShowLoginSection={ handleShowLoginSection } 
                        state={ state } 
                        setIsCartLoading={ setIsCartLoading }
                        cleanCoupon={ () => {
                            setCouponCode('');
                            setCouponDiscount(0);
                        } }
                    />
                    <AddressSection 
                        handleAddressChange={ handleAddressChange } 
                        handleEditingAddressMode={ handleEditingAddressMode }
                        resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) } 
                        state={ state }
                    />
                    <DeliveryPriceSection
                        carrinho={ carrinhoState }
                        userInfo={ userInfo }
                        cartPrice={ cartPrice } 
                        deliveryOptions={ deliveryOptions }
                        handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                        state={ state }
                        setShowPaymentSection={ setShowPaymentSection }
                        setPreferenceId={ setPreferenceId }
                        fetchDeliveryOptions={ fetchDeliveryOptions }
                        couponDiscount={ couponDiscount }
                        
                    />
                    <PaymentSectionWithMercadoPago
                        state={ state }
                        cartPrice={ cartPrice } // valor do carrinho com desconto
                        userInfo={ userInfo }
                        preferenceId={ preferenceId }
                        showPaymentSection={ showPaymentSection }
                        setShowPaymentSection={ setShowPaymentSection }
                        showPaymentFailSection={ showPaymentFailSection }
                        setShowPaymentFailSection={ setShowPaymentFailSection }
                        setIsProcessingPayment={ setIsProcessingPayment }
                        setIsPaymentFinished={ (isPaymentFinished: boolean) => setIsPaymentFinished(isPaymentFinished) }
                        couponDiscount={ couponDiscount }
                        couponId={ couponCode }
                    />
                </div>
            ) : screenSize === 'medium' ? (
                // Layout Medium
                <div className="space-y-6">
                    { /* Duas colunas abaixo */ }
                    <div className="grid grid-cols-2 gap-6">
                        { /* Coluna 1 */ }
                        <div className="space-y-4">
                            <AccountSection 
                                handleShowLoginSection={ handleShowLoginSection } 
                                state={ state } 
                                setIsCartLoading={ setIsCartLoading }
                                cleanCoupon={ () => {
                                    setCouponCode('');
                                    setCouponDiscount(0);
                                } }
                            />
                            <AddressSection 
                                handleAddressChange={ handleAddressChange } 
                                handleEditingAddressMode={ handleEditingAddressMode }
                                resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) }  
                                state={ state }
                            />
                        </div>
                        
                        { /* Coluna 2 */ }
                        <div className="space-y-4">
                            <CouponSection 
                                carrinho={ carrinhoState }
                                fetchDeliveryOptions={ fetchDeliveryOptions }
                                resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) }
                                hiddenPaymentSection={ () => setShowPaymentSection(false) }
                                setCouponDiscount={ (discount: number | 'freteGratis') => setCouponDiscount(discount) }
                                couponDiscount={ couponDiscount }
    

                                setCouponCode={ (code: string) => setCouponCode(code) }

                            />
                            <DeliveryPriceSection
                                cartPrice={ cartPrice } 
                                carrinho={ carrinhoState }
                                userInfo={ userInfo }
                                deliveryOptions={ deliveryOptions }
                                handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                                state={ state }
                                setShowPaymentSection={ setShowPaymentSection }
                                setPreferenceId={ setPreferenceId }
                                fetchDeliveryOptions={ fetchDeliveryOptions }
                                couponDiscount={ couponDiscount }


                            />
                            <PaymentSectionWithMercadoPago
                                state={ state }
                                cartPrice={ cartPrice }
                                userInfo={ userInfo }
                                preferenceId={ preferenceId }
                                showPaymentSection={ showPaymentSection }
                                setShowPaymentSection={ setShowPaymentSection }
                                showPaymentFailSection={ showPaymentFailSection }
                                setShowPaymentFailSection={ setShowPaymentFailSection }
                                setIsProcessingPayment={ setIsProcessingPayment }
                                setIsPaymentFinished={ (isPaymentFinished: boolean) => setIsPaymentFinished(isPaymentFinished) }
                                couponDiscount={ couponDiscount }
                                couponId={ couponCode }
                            />
                        </div>
                    </div>
                </div>
            ) : (
                // Layout Desktop (3 colunas)
                <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                    { /* Coluna 1: Conta e Endereço */ }
                    <div className="space-y-8">
                        <AccountSection 
                            handleShowLoginSection={ handleShowLoginSection } 
                            state={ state } 
                            setIsCartLoading={ setIsCartLoading }
                            cleanCoupon={ () => {
                                setCouponCode('');
                                setCouponDiscount(0);
                            } }
                        />
                        <AddressSection 
                            handleAddressChange={ handleAddressChange } 
                            handleEditingAddressMode={ handleEditingAddressMode }
                            resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) } 
                            state={ state }
                        />
                    </div>
    
                    { /* Coluna 2: Entrega e Pagamento */ }
                    <div className="space-y-8">
                        <CouponSection 
                            carrinho={ carrinhoState }
                            fetchDeliveryOptions={ fetchDeliveryOptions }
                            resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) }
                            hiddenPaymentSection={ () => setShowPaymentSection(false) }
                            setCouponDiscount={ (discount: number | 'freteGratis') => setCouponDiscount(discount) }
                            couponDiscount={ couponDiscount }


                            setCouponCode={ (code: string) => setCouponCode(code) }

                        />
                        <DeliveryPriceSection
                            cartPrice={ cartPrice } 
                            carrinho={ carrinhoState }
                            userInfo={ userInfo }
                            deliveryOptions={ deliveryOptions }
                            handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                            state={ state }
                            setShowPaymentSection={ setShowPaymentSection }
                            setPreferenceId={ setPreferenceId }
                            fetchDeliveryOptions={ fetchDeliveryOptions }
                            couponDiscount={ couponDiscount }


                        />
                        <PaymentSectionWithMercadoPago
                            state={ state }
                            cartPrice={ cartPrice }
                            userInfo={ userInfo }
                            preferenceId={ preferenceId }
                            showPaymentSection={ showPaymentSection }
                            setShowPaymentSection={ setShowPaymentSection }
                            showPaymentFailSection={ showPaymentFailSection }
                            setShowPaymentFailSection={ setShowPaymentFailSection }
                            setIsProcessingPayment={ setIsProcessingPayment }
                            setIsPaymentFinished={ (isPaymentFinished: boolean) => setIsPaymentFinished(isPaymentFinished) }
                            couponDiscount={ couponDiscount }
                            couponId={ couponCode }

                        />
                    </div>
    
                    { /* Coluna 3: Resumo do Pedido */ }
                    <div>
                        <div className="overflow-auto max-h-[calc(100vh-200px)] bg-white">
                            <PriceSummarySection
                                frete={ ((state.deliveryOption?.price) ? state.deliveryOption?.price : 0) }
                                subtotalPrice={ cartPrice }
                                couponDiscount={ couponDiscount }
                            />
                            <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                                <div className="flex justify-between w-full p-4">
                                    <h3 className="text-center self-center md:text-2xl">
                                        Produtos {
                                            (carrinhoState && carrinhoState.length > 0) ? <span className="text-black">
                                                ( { carrinhoState.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0) } )    
                                            </span> : null
                                        }
                                    </h3>
                                    <Link href={ '/carrinho' }><h3 className="text-center text-sm self-center text-[#D4AF37] md:text-lg">Editar produtos</h3></Link>
                                </div>
                                { carrinhoState ? carrinhoState.map((produto: ProductCartType) => {
                                    if (produto && produto.quantidade && produto.quantidade > 0) {
                                        return <SummaryCard key={ produto.skuId } produto={ produto } />;
                                    } else return false;
                                }) : <span>Loading...</span> }
                            </section>
                        </div>
                    </div>
                </div>
            ) }
        </main>
    );
}
