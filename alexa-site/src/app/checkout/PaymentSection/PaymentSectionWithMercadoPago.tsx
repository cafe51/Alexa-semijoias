import { FireBaseDocument, UseCheckoutStateType, UserType } from '@/app/utils/types';
import PaymentSectionPending from './PaymentSectionPending';
import PaymentBrick from './PaymentBrick';
import PaymentFailSection from './PaymentFailSection';

interface PaymentSectionWithMercadoPagoProps {
    state: UseCheckoutStateType;
    cartPrice: number;
    userInfo: (UserType & FireBaseDocument) | null;
    preferenceId: string | undefined;
    showPaymentSection: boolean;
    setShowPaymentSection: (showPaymentSection: boolean) => void;
    showPaymentFailSection: boolean | string;
    setShowPaymentFailSection: (showPaymentFailSection: boolean | string) => void;
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
}: PaymentSectionWithMercadoPagoProps) {
    return (
        <>
            {
                (state.editingAddressMode || !(state.selectedDeliveryOption && state.deliveryOption)) && <PaymentSectionPending />
            }
            {
                !state.editingAddressMode && userInfo && showPaymentSection && state.deliveryOption && state.deliveryOption.price && preferenceId && !showPaymentFailSection &&
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
        </>
    );
}