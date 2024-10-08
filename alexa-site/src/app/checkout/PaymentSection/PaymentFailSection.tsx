// app/checkout/PaymentSection/PaymentSection.tsx
import LargeButton from '@/app/components/LargeButton';

interface PaymentFailSectionProps {
    setShowPaymentSection: (showPaymentSection: boolean) => void; 
    setShowPaymentFailSection: (showPaymentFailSection: boolean) => void;
    showPaymentFailSection: string | true;
}

export default function PaymentFailSection({ setShowPaymentFailSection, setShowPaymentSection, showPaymentFailSection }: PaymentFailSectionProps) {

    return (
        <section className="flex flex-col gap-4 border-red-500 border-2 p-4 rounded-md shadow-md max-w-sm mx-auto bg-white w-full text-center">
            <p className="text-xl font-bold mb-4 text-red-500">{ showPaymentFailSection }</p>
            <p className="text-gray-700 mb-4">Confira seus dados ou tente novamente com um novo cartão.</p>
            <LargeButton color='green' loadingButton={ false } onClick={ 
                () => {
                    setShowPaymentSection(true);
                    setShowPaymentFailSection(false);
                }
            }>
                Tentar novamente
            </LargeButton>
        </section>
    );
}