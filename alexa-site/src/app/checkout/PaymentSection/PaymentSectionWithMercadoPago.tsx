import { FireBaseDocument, UseCheckoutStateType, UserType } from '@/app/utils/types';
import PaymentSectionPending from './PaymentSectionPending';
import PaymentBrick from './PaymentBrick';
import PaymentFailSection from './PaymentFailSection';
import { useState } from 'react';
import LoadingIndicator from '@/app/components/LoadingIndicator';

interface PaymentSectionWithMercadoPagoProps {
    state: UseCheckoutStateType;
    cartPrice: number;
    userInfo: (UserType & FireBaseDocument) | null;
    preferenceId: string | undefined;
    showPaymentSection: boolean;
    setShowPaymentSection: (showPaymentSection: boolean) => void;
    showPaymentFailSection: boolean | string;
    setShowPaymentFailSection: (showPaymentFailSection: boolean | string) => void;
    setIsProcessingPayment: (isProcessing: boolean) => void;
    setIsPaymentFinished: (isPaymentFinished: boolean) => void;

}

export default function PaymentSectionWithMercadoPago({
    state,
    cartPrice,
    userInfo,
    preferenceId,
    showPaymentSection,
    setShowPaymentSection,
    showPaymentFailSection,
    setShowPaymentFailSection,
    setIsProcessingPayment,
    setIsPaymentFinished,
}: PaymentSectionWithMercadoPagoProps) {
    const [loadingPayment, setLoadingPayment] = useState(false);

    return (
        <>
            {
                loadingPayment && <LoadingIndicator />
            }
            {
                (!loadingPayment && state.editingAddressMode || !(state.selectedDeliveryOption && state.deliveryOption)) && <PaymentSectionPending />
            }
            {
                !loadingPayment && !state.editingAddressMode && userInfo && showPaymentSection && state.deliveryOption && state.deliveryOption.price !== null && state.deliveryOption.price !== undefined && preferenceId && !showPaymentFailSection &&
            <PaymentBrick
                totalAmount={ cartPrice + state.deliveryOption.price }
                user={ userInfo }
                state={ state }
                preferenceId={ preferenceId }
                setShowPaymentSection={ (showPaymentSection: boolean) => setShowPaymentSection(showPaymentSection) }
                setShowPaymentFailSection={ (showPaymentFailSection: boolean | string) => setShowPaymentFailSection(showPaymentFailSection) }
                setIsProcessingPayment={ setIsProcessingPayment }
                setIsPaymentFinished={ setIsPaymentFinished }
                setLoadingPayment={ (isPaymentLoading: boolean) => setLoadingPayment(isPaymentLoading) }
            />
            }
            {
                !loadingPayment && showPaymentFailSection && !showPaymentSection &&
            <PaymentFailSection
                setShowPaymentSection={ (showPaymentSection: boolean) => setShowPaymentSection(showPaymentSection) }
                setShowPaymentFailSection={ (showPaymentFailSection: boolean | string) => setShowPaymentFailSection(showPaymentFailSection) }
                showPaymentFailSection= { showPaymentFailSection }
            />
            }
        </>
    );
}
