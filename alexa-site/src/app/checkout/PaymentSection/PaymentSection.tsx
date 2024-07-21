// app/checkout/PaymentSection/PaymentSection.tsx
import ChoosePaymentOptionSection from './ChoosePaymentOptionSection';
import CreditPaymentSection from './CreditPaymentSection';
import PaymentSectionPending from './PaymentSectionPending';
import PixPaymentSection from './PixPaymentSection';
import { UseCheckoutStateType } from '@/app/utils/types';

interface PaymentSectionProps {
    state: UseCheckoutStateType;
    cartPrice: number;
    handleSelectedPaymentOption: (paymentOption: string | null) => void;
}

export default function PaymentSection({  cartPrice, state: { editingAddressMode, deliveryOption, selectedDeliveryOption, selectedPaymentOption }, handleSelectedPaymentOption }: PaymentSectionProps) {
    if (editingAddressMode || !(selectedDeliveryOption && deliveryOption)) return <PaymentSectionPending />;

    const renderPaymentSection = () => {
        if (!selectedPaymentOption) {
            return (
                <ChoosePaymentOptionSection
                    selectedPaymentOption={ selectedPaymentOption }
                    handleSelectedPaymentOption={ handleSelectedPaymentOption }
                    totalPrice={ cartPrice + ((deliveryOption?.price) ? deliveryOption?.price : 0) }
                />

            );
        }

        if (selectedPaymentOption === 'Cartão de Crédito') {
            return (
                <CreditPaymentSection
                    handleSelectedPaymentOption={ handleSelectedPaymentOption }
                    totalPrice={ cartPrice + ((deliveryOption?.price) ? deliveryOption?.price : 0) }
                />

            );
        } 
        if (selectedPaymentOption === 'Pix') {
            return (
                <PixPaymentSection handleSelectedPaymentOption={ handleSelectedPaymentOption }/>

            );
        } 
    };




    return (
        <section className="border p-4 rounded-md shadow-md max-w-sm mx-auto bg-white w-full">
            { renderPaymentSection() }
            <button
                className="bg-green-500 p-2 disabled:bg-yellow-100 disabled:text-gray-400 w-full mt-4"
            >
              Finalizar
            </button>
        </section>
    );
}