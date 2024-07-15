// app/checkout/PaymentSection/InstallmentOptions.tsx

import formatPrice from '@/app/utils/formatPrice';

interface InstallmentOptionsProps {
  totalPrice: number;
  selectedInstallment: number;
  onInstallmentChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
export default function InstallmentOptions({ totalPrice, selectedInstallment, onInstallmentChange }: InstallmentOptionsProps) {
    const maxInstallments = 6;
    const options = Array.from({ length: maxInstallments }, (_, i) => i + 1);

    return (
        <select
            value={ selectedInstallment }
            onChange={ onInstallmentChange }
            className="form-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-green-500 focus:ring focus:ring-green-500 focus:ring-opacity-50"
        >
            { options.map((num) => (
                <option key={ num } value={ num }>
                    { `${num}x de ${formatPrice(totalPrice / num)} - sem juros` }
                </option>
            )) }
        </select>
    );
}

