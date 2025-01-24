// app/checkout/AddressSection/CepInput.tsx

import InputField from './InputField';

interface CepInputProps {
    cep: string;
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    error: string;
    isFormValid: boolean;
}

export default function CepInput({ cep, handleCepChange, loading, error, isFormValid }: CepInputProps) {
    return (
        <div className="flex flex-col w-full py-4 gap-2">
            <InputField
                id="cep"
                value={ cep }
                onChange={ handleCepChange }
                maxLength={ 9 }
                label="CEP"
                readOnly={ false }
            />
            { loading && (
                <div className="text-center">
                    <p className="text-gray-500 text-sm">Buscando endereço...</p>
                </div>
            ) }
            { (error || !isFormValid) && (
                <div className="text-center">
                    <p className="text-red-500 text-sm">{ error }</p>
                </div>
            ) }
        </div>
    );
}
