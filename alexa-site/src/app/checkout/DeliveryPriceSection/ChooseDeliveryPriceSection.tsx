import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/app/utils/formatPrice';
import FreeShippingSection from './FreeShippingSection';
import { DeliveryOptionType, FireBaseDocument, ProductCartType, UserType } from '@/app/utils/types';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface ChooseDeliveryPriceSectionProps {
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
    userInfo: (UserType & FireBaseDocument) | null;
    cartPrice: number;
    deliveryOptions: DeliveryOptionType[];
    selectedDeliveryOption: string | null;
    setSelectedDeliveryOption: (option: string | null) => void;
    setShowPaymentSection: (showPaymentSection: boolean) => void;
    setPreferenceId: (preferenceId: string) => void;
}

export default function ChooseDeliveryPriceSection({
    carrinho,
    userInfo,
    cartPrice,
    deliveryOptions,
    selectedDeliveryOption,
    setSelectedDeliveryOption,
    setShowPaymentSection,
    setPreferenceId,
}: ChooseDeliveryPriceSectionProps) {
    const precoFaltanteParaFreteGratis = 300 - cartPrice;
    const precoFaltanteEmPorcentagem = (cartPrice / 300) * 100 + '%';
    
    // Encontra a opção de frete mais barata
    const cheapestOption = deliveryOptions.reduce((prev, current) => 
        prev.price < current.price ? prev : current,
    );

    const handleOptionChange = async(value: string) => {
        const response = await axios.post('/api/create-preference', {
            items: carrinho,
            userInfo: userInfo,
        }, {
            headers: { 'Content-Type': 'application/json' },
        });
        setPreferenceId(response.data.id);
        setSelectedDeliveryOption(value);
        setShowPaymentSection(true);
    };

    return (
        <Card className="border-[#F8C3D3] shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-50 to-pink-100 border-b border-[#F8C3D3]/30 pb-4">
                <CardTitle className="flex items-center justify-between">
                    <span className="md:text-xl font-semibold text-[#333333]">
                        FORMA DE ENTREGA
                    </span>
                </CardTitle>
            </CardHeader>
          
            <CardContent className="pt-6 px-4 sm:px-6">
                <FreeShippingSection 
                    precoFaltanteEmPorcentagem={ precoFaltanteEmPorcentagem } 
                    precoFaltanteParaFreteGratis={ precoFaltanteParaFreteGratis } 
                />

                <RadioGroup
                    value={ selectedDeliveryOption ? selectedDeliveryOption : undefined }
                    onValueChange={ handleOptionChange }
                    className="space-y-4"
                >
                    { deliveryOptions.map((option) => (
                        <div
                            key={ option.name }
                            className={ cn(
                                'flex items-start space-x-4 p-4 rounded-lg transition-all duration-200',
                                'hover:bg-[#F8C3D3]/10',
                                'border border-gray-100',
                                selectedDeliveryOption === option.name && 'border-[#F8C3D3] bg-pink-50/30',
                            ) }
                        >
                            <RadioGroupItem
                                value={ option.name }
                                id={ option.name }
                                className="mt-1"
                            />
                            <Label
                                htmlFor={ option.name }
                                className="flex-1 flex items-start justify-between cursor-pointer"
                            >
                                <div className="space-y-1">
                                    <p className="font-medium text-gray-900 md:text-xl">
                                        { option.name }
                                    </p>
                                    <p className="text-gray-500 md:text-lg">
                                        Até { option.deliveryTime }
                                        { option.deliveryTime === 1 ? ' dia útil' : ' dias úteis' }
                                    </p>
                                </div>
                                <div className="font-medium text-gray-900 ml-4 md:text-xl">
                                    { precoFaltanteParaFreteGratis <= 0 && option.name === cheapestOption.name ? (
                                        <div className="flex flex-col items-end">
                                            <span className="line-through text-sm text-gray-400">
                                                { formatPrice(option.price) }
                                            </span>
                                            <span className="text-[#D4AF37] text-base font-bold">
                                                GRÁTIS
                                            </span>
                                        </div>
                                    ) : (
                                        formatPrice(option.price)
                                    ) }
                                </div>
                            </Label>
                        </div>
                    )) }
                </RadioGroup>
            </CardContent>
        </Card>
    );
}