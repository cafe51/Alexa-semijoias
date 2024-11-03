// app/checkout/AddressSection/AddressForm.tsx
import { AddressType } from '@/app/utils/types';
import AddressDetails from './AddressDetails';
import CepDisplay from './CepDisplay';
import ErrorMessage from './ErrorMessage';
import ReadOnlyInputField from './ReadOnlyInputField';
import { Button } from '@/components/ui/button';

interface AddressFormProps {
    address: AddressType;
    cep: string;
    handleCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleStateAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: () => void;
    isFormValid: () => boolean;
    loading: boolean;
    formError: string;
}

export default function AddressForm({ address, cep, handleCepChange, handleStateAddressChange, handleFormSubmit, isFormValid, loading, formError }: AddressFormProps) {
    return (
        <div className="flex flex-col p-2 w-full gap-6 md:gap-8">
            <CepDisplay cep={ cep } handleCepChange={ handleCepChange } address={ address } />
            <ReadOnlyInputField id="logradouro" value={ address.logradouro } label="Rua" />
            <AddressDetails address={ address } handleStateAddressChange={ handleStateAddressChange } />
            { formError && <ErrorMessage message={ formError } /> }
            <Button
                className="bg-[#D4AF37] text-white hover:bg-[#C48B9F] flex-1 md:text-xl" onClick={ handleFormSubmit }
                disabled={ loading || !isFormValid() }
            >
                Confirmar
            </Button>
        </div>
    );
}