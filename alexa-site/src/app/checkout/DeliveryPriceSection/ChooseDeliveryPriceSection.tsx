// app/checkout/DeliveryPriceSection/ChooseDeliveryPriceSection.tsx
import { formatPrice } from '@/app/utils/formatPrice';
import FreeShippingSection from './FreeShippingSection';
import { DeliveryOptionType } from '@/app/utils/types';

const cartPrice = 189;
const precoFaltanteParaFreteGratis = 250 - cartPrice;
const precoFaltanteEmPorcentagem = (cartPrice / 250) * 100 + '%';

interface ChooseDeliveryPriceSectionProps {
    deliveryOptions: DeliveryOptionType[];
    selectedDeliveryOption:string | null;
    setSelectedDeliveryOption:  (option: string | null) => void;
    setShowPaymentSection: (showPaymentSection: boolean) => void;
}

export default function ChooseDeliveryPriceSection({
    deliveryOptions,
    selectedDeliveryOption,
    setSelectedDeliveryOption,
    setShowPaymentSection,
}: ChooseDeliveryPriceSectionProps) {
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDeliveryOption(event.target.value);
        setShowPaymentSection(true);
        console.log(selectedDeliveryOption);
    };

    return (
        <section className="border p-4 rounded-md shadow-md max-w-sm mx-auto bg-white w-full">
            <h3 className="text-lg font-semibold mb-4">
                <span className="mr-2">3</span>Forma de entrega
            </h3>
            {
                (precoFaltanteParaFreteGratis > 0) ? <FreeShippingSection precoFaltanteEmPorcentagem={ precoFaltanteEmPorcentagem } precoFaltanteParaFreteGratis={ precoFaltanteParaFreteGratis } /> : ''
            }
            { deliveryOptions.map((option) => (
                <label key={ option.name } className="flex justify-between items-center border-b py-2 last:border-b-0">
                    <input
                        type="radio"
                        name="delivery"
                        value={ option.name }
                        checked={ selectedDeliveryOption === option.name }
                        onChange={ handleOptionChange }
                        className="form-radio h-6 w-6 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-2">
                        <p className="text-sm font-medium">{ option.name }</p>
                        <p className="text-xs text-gray-500">{ 'Até ' + option.deliveryTime + (option.deliveryTime === 1 ? ' dia útil' : ' dias úteis') }</p>
                    </div>
                    <div className="ml-auto">
                        <p className="text-sm font-medium">{ formatPrice(option.price) }</p>
                    </div>
                </label>
            )) }
        </section>
    );
}
