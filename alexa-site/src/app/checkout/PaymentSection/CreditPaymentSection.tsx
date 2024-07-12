// app/checkout/PaymentSection/CreditPaymentSection.tsx

import { useState } from 'react';
import InstallmentOptions from './InstallmentOptions';
import InputField from '../AddressSection/InputField';

interface CreditPaymentSectionProps {
    setSelectedPaymentOption: (paymentOption: string | null) => void;
}

const totalPrice = 89.39; // exemplo de preço total

const months = [
    { value: '', label: 'Mês' },
    { value: '01', label: 'Janeiro' },
    { value: '02', label: 'Fevereiro' },
    { value: '03', label: 'Março' },
    { value: '04', label: 'Abril' },
    { value: '05', label: 'Maio' },
    { value: '06', label: 'Junho' },
    { value: '07', label: 'Julho' },
    { value: '08', label: 'Agosto' },
    { value: '09', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' },
];

const years = Array.from({ length: 57 }, (_, i) => ({ value: (24 + i).toString(), label: (24 + i).toString() }));

export default function CreditPaymentSection({ setSelectedPaymentOption }: CreditPaymentSectionProps) {
    const [selectedInstallment, setSelectedInstallment] = useState(1);
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [cardMonth, setCardMonth] = useState('');
    const [cardYear, setCardYear] = useState('');
    const [cardCVC, setCardCVC] = useState('');

    const handleInstallmentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInstallment(Number(event.target.value));
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">PAGAMENTO</h3>
                <button
                    onClick={ () => setSelectedPaymentOption(null) }
                    className="text-sm text-green-500">
                    Alterar
                </button>
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
                <div className="flex items-center mb-4">
                    <div className="form-radio h-6 w-6 rounded-full bg-green-500 border-green-500 flex-shrink-0"></div>
                    <span className="ml-2 text-sm font-medium">Cartão de Crédito</span>
                </div>
                <InputField
                    id="cardNumber"
                    value={ cardNumber }
                    onChange={ (e) => setCardNumber(e.target.value) }
                    label="Número do cartão"
                />
                <InputField
                    id="cardName"
                    value={ cardName }
                    onChange={ (e) => setCardName(e.target.value) }
                    label="Nome completo no cartão"
                />
                <div className="flex mb-4">
                    <div className="relative mb-4 w-1/2 mr-2">
                        <select
                            id="cardMonth"
                            value={ cardMonth }
                            onChange={ (e) => setCardMonth(e.target.value) }
                            className="border-4 p-2 w-full peer"
                        >
                            { months.map((month) => (
                                <option key={ month.value } value={ month.value }>
                                    { month.label }
                                </option>
                            )) }
                        </select>
                        <label
                            htmlFor="cardMonth"
                            className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out  ${'-top-2.5 text-xs bg-white px-1'} peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                        >
              Mês
                        </label>
                    </div>
                    <div className="relative mb-4 w-1/2">
                        <select
                            id="cardYear"
                            value={ cardYear }
                            onChange={ (e) => setCardYear(e.target.value) }
                            className="border-4 p-2 w-full peer"
                        >
                            <option value="">Ano</option>
                            { years.map((year) => (
                                <option key={ year.value } value={ year.value }>
                                    { year.label }
                                </option>
                            )) }
                        </select>
                        <label
                            htmlFor="cardYear"
                            className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${'-top-2.5 text-xs bg-white px-1'} peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                        >
              Ano
                        </label>
                    </div>
                </div>
                <InputField
                    id="cardCVC"
                    value={ cardCVC }
                    onChange={ (e) => setCardCVC(e.target.value) }
                    label="Cód de segurança"
                />
                <InstallmentOptions
                    totalPrice={ totalPrice }
                    selectedInstallment={ selectedInstallment }
                    onInstallmentChange={ handleInstallmentChange }
                />
            </div>
        </>
    );
}

