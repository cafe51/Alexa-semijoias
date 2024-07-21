// app/checkout/PaymentSection/PixPaymentSection.tsx
import { useState } from 'react';
import InputField from '../AddressSection/InputField';

interface PixPaymentSectionProps {
    handleSelectedPaymentOption: (paymentOption: string | null) => void;
}

export default function PixPaymentSection({ handleSelectedPaymentOption }: PixPaymentSectionProps) {
    const [cpf, setCpf] = useState('');

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">PAGAMENTO</h3>
                <button
                    onClick={ () => handleSelectedPaymentOption(null) }
                    className="text-sm text-green-500">
                    Alterar
                </button>
            </div>
            <div className="p-4 bg-gray-100 rounded-md">
                <div className="flex items-center mb-4">
                    <div className="form-radio h-6 w-6 rounded-full bg-green-500 border-green-500 flex-shrink-0"></div>
                    <span className="ml-2 text-sm font-medium">PIX</span>
                </div>
                <div className="flex mb-4 w-full ">
                    <img src='/pix-275e21bd.svg' alt="Pix Logo" className="" />
                </div>
                <div className="mb-4 pl-2">
                    <div className="flex items-center mb-2">
                        <div className="h-6 w-6 p-3 border-green-400 border-2 bg-white text-green-400 rounded-full flex items-center justify-center mr-2">1</div>
                        <p className="text-sm">Finalize sua compra e abra o app do banco na opção Pix</p>
                    </div>
                    <div className="flex items-center mb-2">
                        <div className="h-6 w-6 p-3 border-green-400 border-2 bg-white text-green-400 rounded-full flex items-center justify-center mr-2">2</div>
                        <p className="text-sm">Aponte a câmera do celular para o código ou copie e cole o código</p>
                    </div>
                    <div className="flex items-center mb-2">
                        <div className="h-6 w-6 p-3 border-green-400 border-2 bg-white text-green-400 rounded-full flex items-center justify-center mr-2">3</div>
                        <p className="text-sm">Confira os dados e confirme seu pagamento pelo app do banco</p>
                    </div>
                </div>
                <InputField
                    id="cpf"
                    value={ cpf }
                    onChange={ (e) => setCpf(e.target.value) }
                    label="Adicione seu CPF"
                />
            </div>
        </>
    );
}
