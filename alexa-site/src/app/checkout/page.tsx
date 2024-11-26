// app/checkout/page.tsx
'use client';
import { useCheckoutState } from '../hooks/useCheckoutState';
import { useUserInfo } from '../hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountSection from './AccountSection/AccountSection';
import AddressSection from './AddressSection/AddressSection';
import DeliveryPriceSection from './DeliveryPriceSection/DeliveryPriceSection';
import OrderSummarySection from './OrderSummarySection/OrderSummarySection';
import PaymentSectionWithMercadoPago from './PaymentSection/PaymentSectionWithMercadoPago';
import { useWindowSize } from '../hooks/useWindowSize';
import PriceSummarySection from './OrderSummarySection/PriceSummarySection';
import Link from 'next/link';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import SummaryCard from './OrderSummarySection/SummaryCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { useCollection } from '../hooks/useCollection';

export default function Checkout() {
    const router = useRouter();
    const { userInfo, carrinho } = useUserInfo();
    const { deleteDocument: deleteCartItemFromDb } = useCollection<ProductCartType>('carrinhos');
    const [ loadingScreen, setLoadingScreen ] = useState(true);
    const [cartPrice, setCartPrice] = useState(0);
    const [isCartLoading, setIsCartLoading] = useState(true);
    const [showPaymentSection, setShowPaymentSection] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | undefined>(undefined);
    const [showPaymentFailSection, setShowPaymentFailSection] = useState<boolean | string>(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [isPaymentFinished, setIsPaymentFinished] = useState(false);


    const { screenSize } = useWindowSize();

    const {
        state,
        handleShowLoginSection,
        handleAddressChange,
        handleEditingAddressMode,
        handleSelectedDeliveryOption,
        // handleSelectedPaymentOption,
        deliveryOptions,
        handleShowFullOrderSummary,
    } = useCheckoutState();

    useEffect(() => {
        if(isPaymentFinished) {
            if(carrinho && carrinho.length > 0) {
                for (const cartItem  of carrinho) {
                    const { id } = cartItem as ProductCartType & FireBaseDocument;
                    deleteCartItemFromDb(id);
                }
            }
            setIsPaymentFinished(false);
        }
    }, [isPaymentFinished, deleteCartItemFromDb, carrinho]);

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
        if (carrinho) {
            setCartPrice(
                Number(carrinho
                    ?.map((items) => (Number(items.quantidade) * (items.value.promotionalPrice ? items.value.promotionalPrice : items.value.price)))
                    .reduce((a, b) => a + b, 0)),
            );
        }
    }, [carrinho]);


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
                        carrinho={ carrinho } 
                        cartPrice={ cartPrice } 
                        handleShowFullOrderSummary={ handleShowFullOrderSummary }
                        state={ state }
                    />
                    <AccountSection 
                        handleShowLoginSection={ handleShowLoginSection } 
                        state={ state } 
                        setIsCartLoading={ setIsCartLoading }
                    />
                    <AddressSection 
                        handleAddressChange={ handleAddressChange } 
                        handleEditingAddressMode={ handleEditingAddressMode }
                        resetSelectedDeliveryOption={ () => handleSelectedDeliveryOption(null) } 
                        state={ state }
                    />
                    <DeliveryPriceSection
                        deliveryOptions={ deliveryOptions }
                        handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                        state={ state }
                        setShowPaymentSection={ setShowPaymentSection }
                        setPreferenceId={ setPreferenceId }
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
                    />
                </div>
            ) : screenSize === 'medium' ? (
                // Layout Medium
                <div className="space-y-6">
                    { /* Order Summary no topo */ }
                    <div className="w-full">
                        <OrderSummarySection 
                            carrinho={ carrinho } 
                            cartPrice={ cartPrice } 
                            handleShowFullOrderSummary={ handleShowFullOrderSummary }
                            state={ state }
                        />
                    </div>
                    
                    { /* Duas colunas abaixo */ }
                    <div className="grid grid-cols-2 gap-6">
                        { /* Coluna 1 */ }
                        <div className="space-y-4">
                            <AccountSection 
                                handleShowLoginSection={ handleShowLoginSection } 
                                state={ state } 
                                setIsCartLoading={ setIsCartLoading }
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
                            <DeliveryPriceSection
                                deliveryOptions={ deliveryOptions }
                                handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                                state={ state }
                                setShowPaymentSection={ setShowPaymentSection }
                                setPreferenceId={ setPreferenceId }
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
                        <DeliveryPriceSection
                            deliveryOptions={ deliveryOptions }
                            handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                            state={ state }
                            setShowPaymentSection={ setShowPaymentSection }
                            setPreferenceId={ setPreferenceId }
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
                        />
                    </div>
    
                    { /* Coluna 3: Resumo do Pedido */ }
                    <div>
                        <div className="overflow-auto max-h-[calc(100vh-200px)] bg-white">
                            <PriceSummarySection
                                frete={ ((state.deliveryOption?.price) ? state.deliveryOption?.price : 0) }
                                subtotalPrice={ cartPrice }
                            />
                            <section className="flex flex-col gap-1 w-full border border-gray-100 shadow-lg mt-4">
                                <div className="flex justify-between w-full p-4">
                                    <h3 className="text-center self-center md:text-2xl">
                                        Produtos {
                                            (carrinho && carrinho.length > 0) ? <span className="text-black">
                                                ( { carrinho.map((items) => (Number(items.quantidade))).reduce((a, b) => a + b, 0) } )    
                                            </span> : null
                                        }
                                    </h3>
                                    <Link href={ '/carrinho' }><h3 className="text-center text-sm self-center text-[#D4AF37] md:text-lg">Editar produtos</h3></Link>
                                </div>
                                { carrinho ? carrinho.map((produto: ProductCartType) => {
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
