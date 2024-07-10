// app/checkout/AddressSection/CepInput.tsx

import ErrorMessage from './ErrorMessage';
import InputField from './InputField';

interface CepInputProps {
    cep: string;
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCepSubmit: () => void;
    loading: boolean;
    error: string;
}

export default function CepInput({ cep, handleCepChange, handleCepSubmit, loading, error }: CepInputProps) {
    return (
        <div className="flex flex-col w-full border-2 p-2 gap-2">
            <InputField
                id="cep"
                value={ cep }
                onChange={ handleCepChange }
                maxLength={ 9 }
                label="CEP"
                readOnly={ false }
            />
            <button
                onClick={ handleCepSubmit }
                disabled={ loading || cep.replace('-', '').length !== 8 }
                className="bg-yellow-300 p-2"
            >
                { loading ? 'Buscando...' : 'Buscar' }
            </button>
            { error && <ErrorMessage message={ error } /> }
        </div>
    );
}