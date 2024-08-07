// app/checkout/AddressSection/AddressDetails.tsx
import { AddressType } from '@/app/utils/types';
import InputField from './InputField';
import ReadOnlyInputField from './ReadOnlyInputField';

export default function AddressDetails({ address, handleStateAddressChange }: { address: AddressType; handleStateAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <>
            <InputField id="numero" name="numero" value={ address.numero || '' } onChange={ handleStateAddressChange } label="Número" />
            <InputField id="complemento" name="complemento" value={ address.complemento || '' } onChange={ handleStateAddressChange } label="Complemento" />
            <ReadOnlyInputField id="bairro" value={ address.bairro } label="Bairro" />
            <InputField id="referencia" name="referencia" value={ address.referencia || '' } onChange={ handleStateAddressChange } label="Referência" />
        </>
    );
}