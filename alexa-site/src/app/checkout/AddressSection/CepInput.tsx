// app/checkout/AddressSection/CepInput.tsx

import ErrorMessage from './ErrorMessage';
import InputField from './InputField';

interface CepInputProps {
    cep: string;
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    error: string;
}

export default function CepInput({ cep, handleCepChange, loading, error }: CepInputProps) {
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
            <div
                className="text-center p-2"
            >
                <p className='text-red-500'>{ loading ? 'Buscando endereço...' : 'CEP não encontrado' }</p>
            </div>
            { error && <ErrorMessage message={ error } /> }
        </div>
    );
}