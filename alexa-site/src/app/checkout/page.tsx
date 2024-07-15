// app/checkout/page.tsx

'use client';

import { useCheckoutState } from '../hooks/useCheckoutState';
import AddressSection from './AddressSection/AddressSection';
import AddressSectionFilled from './AddressSection/AddressSectionFilled';
import AccountSection from './AccountSection';
import DeliveryPriceSection from './DeliveryPriceSection/DeliveryPriceSection';
import DeliveryPriceSectionFilled from './DeliveryPriceSection/DeliveryPriceSectionFilled';
import DeliveryPriceSectionPending from './DeliveryPriceSection/DeliveryPriceSectionPending';
import { useUserInfo } from '../hooks/useUserInfo';
import { useEffect } from 'react';
import PaymentSection from './PaymentSection/PaymentSection';
import PaymentSectionPending from './PaymentSection/PaymentSectionPending';
import OrderSummary from './OrderSummarySection/OrderSummary';

export default function Checkout() {
    const { userInfo } = useUserInfo();
    const {
        state,
        handleAddressChange,
        handleEditingAddressMode,
        handleSelectedDeliveryOption,
        handleSelectedPaymentOption,
        deliveryOptions,
        handleShowFullOrderSummary,
    } = useCheckoutState();

    useEffect(() => { console.log(state); }, [state]);

    useEffect(() => {
        if (!userInfo?.address) {
            handleEditingAddressMode(true);
        } else {
            handleEditingAddressMode(false);
        }
    }, [userInfo?.address]);

    const renderAddressSection = () => {
        if (state.editingAddressMode) {
            return (
                <AddressSection 
                    address={ state.address } 
                    setAddress={ handleAddressChange } 
                    setEditingAddressMode={ handleEditingAddressMode } 
                />
            );
        } 
        return (
            <AddressSectionFilled 
                address={ state.address } 
                setEditingAddressMode={ handleEditingAddressMode } 
            />
        );
    };

    const renderDeliverySection = () => {
        if (state.editingAddressMode) {
            return <DeliveryPriceSectionPending />;
        } 
        if (state.selectedDeliveryOption && state.deliveryOption) {
            return (
                <DeliveryPriceSectionFilled
                    setSelectedDeliveryOption={ handleSelectedDeliveryOption }
                    price={ state.deliveryOption.price }
                    term={ state.deliveryOption.deliveryTime }
                    type={ state.deliveryOption.name }
                />
            );
        } 
        return (
            <DeliveryPriceSection
                deliveryOptions={ deliveryOptions }
                selectedDeliveryOption={ state.selectedDeliveryOption }
                setSelectedDeliveryOption={ handleSelectedDeliveryOption }
            />
        );
    };

    const renderPaymentSection = () => {
        if (state.editingAddressMode || !(state.selectedDeliveryOption && state.deliveryOption)) {
            return (
                <PaymentSectionPending />
            );
        }

        return (
            <PaymentSection selectedPaymentOption={ state.selectedPaymentOption } setSelectedPaymentOption={ handleSelectedPaymentOption }/>
        );
    };

    const renderOrderSummarySection = () => {
        if (state.showFullOrderSummary) {
            return (
                <OrderSummary setShowFullOrderSummary={ handleShowFullOrderSummary }/>
            );
        }

        return (
            <section
                className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'
                onClick={ () => { handleShowFullOrderSummary(true); } }
            >
                <div className='flex justify-between w-full'>
                    <p>Ver resumo</p>
                    <p>R$ 156,00</p>
                </div>
            </section>
        );
    };

    return (
        <main className='flex flex-col w-full gap-2 relative'>
            { renderOrderSummarySection() }
            { userInfo && <AccountSection cpf={ userInfo.cpf } email={ userInfo.email } telefone={ userInfo.tel } /> }
            { renderAddressSection() }
            { renderDeliverySection() }
            { renderPaymentSection() }
        </main>
    );
}
