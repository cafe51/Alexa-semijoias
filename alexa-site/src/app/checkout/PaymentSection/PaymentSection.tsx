// app/checkout/PaymentSection/PaymentSection.tsx

import ChoosePaymentOptionSection from './ChoosePaymentOptionSection';
import CreditPaymentSection from './CreditPaymentSection';
import PixPaymentSection from './PixPaymentSection';

interface PaymentSectionProps {
    selectedPaymentOption: string | null;
    setSelectedPaymentOption: (paymentOption: string | null) => void;
}

export default function PaymentSection({ selectedPaymentOption, setSelectedPaymentOption }: PaymentSectionProps) {

    const renderPaymentSection = () => {
        if (!selectedPaymentOption) {
            return (
                <ChoosePaymentOptionSection selectedPaymentOption={ selectedPaymentOption } setSelectedPaymentOption={ setSelectedPaymentOption }/>

            );
        }

        if (selectedPaymentOption === 'Cartão de Crédito') {
            return (
                <CreditPaymentSection setSelectedPaymentOption={ setSelectedPaymentOption }/>

            );
        } 
        if (selectedPaymentOption === 'Pix') {
            return (
                <PixPaymentSection setSelectedPaymentOption={ setSelectedPaymentOption }/>

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