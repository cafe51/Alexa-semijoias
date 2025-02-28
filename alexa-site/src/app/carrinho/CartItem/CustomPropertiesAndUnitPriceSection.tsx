import DisplayCustomProperties from '@/app/components/DisplayCustomProperties';
import { formatPrice } from '@/app/utils/formatPrice';
import { CustomPropertiesAndUnitPriceSectionProps } from './cartCardInterfaces';


export default function CustomPropertiesAndUnitPriceSection({ cartItem }: CustomPropertiesAndUnitPriceSectionProps) {
    return (
        <div className="flex flex-col ">
            { cartItem.customProperties && (
                <DisplayCustomProperties customProperties={ cartItem.customProperties } />
            ) }
            <p className="text-gray-600 mt-1">
                { formatPrice(cartItem.value.promotionalPrice || cartItem.value.price) }
            </p>
        </div>
    );
}