// app/checkout/AddressSection/CepDisplay.tsx

import { AddressType } from '@/app/utils/types';
import InputField from './InputField';

export default function CepDisplay({ cep, handleCepChange, address }: { cep: string; handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void; address: AddressType }) {
    return (
        <div className="flex w-full justify-between gap-4">
            <InputField
                id="cep"
                value={ cep }
                onChange={ handleCepChange }
                maxLength={ 9 }
                label="CEP"
                readOnly={ false }
            />
            <div className="flex items-center">
                <p>{ address.localidade } / { address.uf }</p>
            </div>
        </div>
    );
}