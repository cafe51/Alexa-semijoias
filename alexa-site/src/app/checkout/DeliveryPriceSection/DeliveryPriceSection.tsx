// app/checkout/DeliveryPriceSection/DeliveryPriceSection.tsx

import React, { useState } from 'react';
import FreeShippingSection from './FreeShippingSection';

interface DeliveryOption {
  name: string;
  deliveryTime: number;
  price: number;
}

const cartPrice = 189;
const precoFaltanteParaFreteGratis = 250 - cartPrice;
const precoFaltanteEmPorcentagem = (cartPrice / 250) * 100 + '%';

const deliveryOptions: DeliveryOption[] = [
    { name: 'PAC', deliveryTime: 22, price: 29.45 },
    { name: 'Sedex', deliveryTime: 1, price: 56.31 },
];

export default function DeliveryPriceSection() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
        console.log(selectedOption);
    };

    return (
        <div className="border p-4 rounded-md shadow-md max-w-sm mx-auto bg-white w-full">
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
                        checked={ selectedOption === option.name }
                        onChange={ handleOptionChange }
                        className="form-radio h-6 w-6 text-green-500 border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-2">
                        <p className="text-sm font-medium">{ option.name }</p>
                        <p className="text-xs text-gray-500">{ 'Até ' + option.deliveryTime + (option.deliveryTime === 1 ? ' dia útil' : ' dias úteis') }</p>
                    </div>
                    <div className="ml-auto">
                        <p className="text-sm font-medium">{ 'R$ ' + option.price.toFixed(2) }</p>
                    </div>
                </label>
            )) }
        </div>
    );
}