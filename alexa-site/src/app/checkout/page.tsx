// app/checkout/page.tsx
'use client';
import { useCheckoutState } from '../hooks/useCheckoutState';
import { useUserInfo } from '../hooks/useUserInfo';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AccountSection from './AccountSection/AccountSection';
import AddressSection from './AddressSection/AddressSection';
import DeliveryPriceSection from './DeliveryPriceSection/DeliveryPriceSection';
// import PaymentSection from './PaymentSection/PaymentSection';
import OrderSummarySection from './OrderSummarySection/OrderSummarySection';
import PaymentBrick from './PaymentSection/PaymentBrick';
import PaymentFailSection from './PaymentSection/PaymentFailSection';

export default function Checkout() {
    const router = useRouter();
    const { userInfo, carrinho } = useUserInfo();
    const [ loadingScreen, setLoadingScreen ] = useState(true);
    const [cartPrice, setCartPrice] = useState(0);
    const [isCartLoading, setIsCartLoading] = useState(true);
    const [showPaymentSection, setShowPaymentSection] = useState(false);
    const [preferenceId, setPreferenceId] = useState<string | undefined>(undefined);
    const [showPaymentFailSection, setShowPaymentFailSection] = useState<boolean | string>(false);

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
        if (!isCartLoading) {
            if (carrinho && carrinho.length > 0) {
                setLoadingScreen(false);
            } else {
                router.push('/carrinho');
            }
        }
    }, [carrinho, isCartLoading, router]);

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


    useEffect(() => {console.log(state);}, [state]);

    if(loadingScreen) return <p>Loading...</p>;

    return (
        <main className='flex flex-col w-full gap-2 relative'>
            <OrderSummarySection carrinho={ carrinho } cartPrice={ cartPrice } handleShowFullOrderSummary={ handleShowFullOrderSummary }state={ state }/>
            <AccountSection handleShowLoginSection={ handleShowLoginSection } state={ state } setIsCartLoading={ setIsCartLoading }/>
            <AddressSection handleAddressChange={ handleAddressChange } handleEditingAddressMode={ handleEditingAddressMode } state={ state } />
            <DeliveryPriceSection
                deliveryOptions={ deliveryOptions }
                handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                state={ state }
                setShowPaymentSection={ (showPaymentSection: boolean) => setShowPaymentSection(showPaymentSection) }
                setPreferenceId = { (preferenceId: string) => setPreferenceId(preferenceId) }
            />
            {
                userInfo && showPaymentSection && state.deliveryOption && state.deliveryOption.price && preferenceId && !showPaymentFailSection &&
                    <PaymentBrick
                        totalAmount={ cartPrice + state.deliveryOption.price }
                        user={ userInfo }
                        state={ state }
                        preferenceId={ preferenceId }
                        setShowPaymentSection={ (showPaymentSection: boolean) => setShowPaymentSection(showPaymentSection) }
                        setShowPaymentFailSection={ (showPaymentFailSection: boolean | string) => setShowPaymentFailSection(showPaymentFailSection) }
                    />
            }
            {
                showPaymentFailSection && !showPaymentSection &&
                    <PaymentFailSection
                        setShowPaymentSection={ (showPaymentSection: boolean) => setShowPaymentSection(showPaymentSection) }
                        setShowPaymentFailSection={ (showPaymentFailSection: boolean | string) => setShowPaymentFailSection(showPaymentFailSection) }
                        showPaymentFailSection= { showPaymentFailSection }
                    />
                // <PaymentSection cartPrice={ cartPrice } handleSelectedPaymentOption={ handleSelectedPaymentOption } state={ state }/>
            }
        </main>
    );
}
