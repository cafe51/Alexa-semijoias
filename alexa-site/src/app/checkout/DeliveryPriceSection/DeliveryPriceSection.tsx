// app/checkout/DeliveryPriceSection/DeliveryPriceSection.tsx
import DeliveryPriceSectionFilled from './DeliveryPriceSectionFilled';
import DeliveryPriceSectionPending from './DeliveryPriceSectionPending';
import { DeliveryOptionType, UseCheckoutStateType, FireBaseDocument, ProductCartType, UserType } from '@/app/utils/types';
import ChooseDeliveryPriceSection from './ChooseDeliveryPriceSection';

interface DeliveryPriceSectionProps {
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
    userInfo: (UserType & FireBaseDocument) | null;
    cartPrice: number;
    state: UseCheckoutStateType;
    deliveryOptions: DeliveryOptionType[];
    handleSelectedDeliveryOption: (option: string | null) => void;
    setShowPaymentSection: (showPaymentSection: boolean) => void;
    setPreferenceId: (preferenceId: string) => void;
    fetchDeliveryOptions: () => void;
}

export default function DeliveryPriceSection(
    {
        state: { editingAddressMode, deliveryOption, selectedDeliveryOption },
        carrinho,
        userInfo,
        cartPrice,
        handleSelectedDeliveryOption,
        deliveryOptions,
        setShowPaymentSection,
        setPreferenceId,
        fetchDeliveryOptions,
    }: DeliveryPriceSectionProps) {

    if (editingAddressMode) return <DeliveryPriceSectionPending />;
        
    if (selectedDeliveryOption && deliveryOption) {
        return (
            <DeliveryPriceSectionFilled
                handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                price={ deliveryOption.price }
                term={ deliveryOption.deliveryTime }
                type={ deliveryOption.name }
                setShowPaymentSection={ setShowPaymentSection }
                fetchDeliveryOptions={ fetchDeliveryOptions }
            />
        );
    } 
    return (
        <ChooseDeliveryPriceSection
            carrinho={ carrinho }
            userInfo={ userInfo }
            cartPrice={ cartPrice }
            deliveryOptions={ deliveryOptions }
            setShowPaymentSection={ setShowPaymentSection }
            selectedDeliveryOption={ selectedDeliveryOption }
            setSelectedDeliveryOption={ handleSelectedDeliveryOption }
            setPreferenceId = { (preferenceId: string) => setPreferenceId(preferenceId) }

        />
    );
}