// app/checkout/DeliveryPriceSection/DeliveryPriceSection.tsx
import DeliveryPriceSectionFilled from './DeliveryPriceSectionFilled';
import DeliveryPriceSectionPending from './DeliveryPriceSectionPending';
import ChooseDeliveryPriceSection from './ChooseDeliveryPriceSection';
import { DeliveryOptionType, UseCheckoutStateType } from '@/app/utils/types';

interface DeliveryPriceSectionProps {
    state: UseCheckoutStateType;
    deliveryOptions: DeliveryOptionType[];
    handleSelectedDeliveryOption:  (option: string | null) => void
}

export default function DeliveryPriceSection(
    { state: { editingAddressMode, deliveryOption, selectedDeliveryOption },
        handleSelectedDeliveryOption,
        deliveryOptions,
    }: DeliveryPriceSectionProps) {

    if (editingAddressMode) return <DeliveryPriceSectionPending />;
        
    if (selectedDeliveryOption && deliveryOption) {
        return (
            <DeliveryPriceSectionFilled
                handleSelectedDeliveryOption={ handleSelectedDeliveryOption }
                price={ deliveryOption.price }
                term={ deliveryOption.deliveryTime }
                type={ deliveryOption.name }
            />
        );
    } 
    return (
        <ChooseDeliveryPriceSection
            deliveryOptions={ deliveryOptions }
            selectedDeliveryOption={ selectedDeliveryOption }
            setSelectedDeliveryOption={ handleSelectedDeliveryOption }
        />
    );
}