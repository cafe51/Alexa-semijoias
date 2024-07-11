// app/checkout/PaymentSection/ChoosePaymentOptionSection.tsx

import { useState } from 'react';

const finalPrice = 89.39;

export default function ChoosePaymentOptionSection() {
    const [selectedPaymentOption, setSelectedPaymentOption] = useState<string | null>(null);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentOption(event.target.value);
        console.log(selectedPaymentOption);
    };

    return (
        <div className="border p-4 rounded-md shadow-md max-w-sm mx-auto bg-white w-full">
            <h3 className="text-lg font-semibold mb-4">
                <span className="mr-2">3</span>PAGAMENTO
            </h3>
            <label className="flex justify-between items-center border-b py-2 last:border-b-0">
                <input
                    type="radio"
                    name="payment"
                    value='Cartão de Crédito'
                    checked={ selectedPaymentOption === 'Cartão de Crédito' }
                    onChange={ handleOptionChange }
                    className="form-radio h-6 w-6 text-green-500 border-gray-300 focus:ring-green-500"
                />
                <div className="ml-2">
                    <p className="text-sm font-medium">Cartão de Crédito</p>
                </div>
                <div className="ml-auto text-end">
                    <p className="text-sm font-medium">{ 'R$ ' + finalPrice.toFixed(2) }</p>
                    <p className="text-xs text-green-500">{ 'até 6x R$ ' + (finalPrice/6).toFixed(2) }</p>

                </div>
            </label>
            <label className="flex justify-between items-center border-b py-2 last:border-b-0">
                <input
                    type="radio"
                    name="payment"
                    value='Pix'
                    checked={ selectedPaymentOption === 'Pix' }
                    onChange={ handleOptionChange }
                    className="form-radio h-6 w-6 text-green-500 border-gray-300 focus:ring-green-500"
                />
                <div className="ml-2">
                    <p className="text-sm font-medium">Pix</p>
                </div>
                <div className="ml-auto">
                    <p className="text-sm font-medium">{ 'R$ ' + finalPrice.toFixed(2) }</p>
                </div>
            </label>
        </div>
    );
}
