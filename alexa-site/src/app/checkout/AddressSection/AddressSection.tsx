// app/checkout/AddressSection/AddressSection.tsx

import { useState, Dispatch, SetStateAction } from 'react';
import fetchAddressFromCEP from '../../utils/fetchAddressFromCEP';
import { AddressType } from '../../utils/types';
import { formatCep } from '../../utils/formatCep';
import AddressForm from './AddressForm';
import CepInput from './CepInput';
import { useCollection } from '@/app/hooks/useCollection';
import { useUserInfo } from '@/app/hooks/useUserInfo';

interface AddressSectionProps {
    address: AddressType;
    setAddress: Dispatch<SetStateAction<AddressType>>;
    setEditingMode: Dispatch<SetStateAction<boolean>>; 
}


export default function AddressSection({ address, setAddress, setEditingMode }: AddressSectionProps) {
    const { updateDocumentField } = useCollection('usuarios');
    const { userInfo } = useUserInfo();
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = formatCep(e.target.value);
        setCep(newCep);
        if (newCep.replace('-', '').length === 8) {
            handleCepSubmit(newCep.replace('-', ''));
        }
    };

    const handleCepSubmit = async(cepToFetch: string) => {
        setLoading(true);
        setError('');
        try {
            const fetchedAddress = await fetchAddressFromCEP(cepToFetch);
            if (fetchedAddress.erro) {
                setError('CEP inválido ou não encontrado.');
            } else {
                setAddress(fetchedAddress);
                setCep(formatCep(cepToFetch));
            }
        } catch {
            setError('CEP inválido ou não encontrado.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(prevAddress => ({ ...prevAddress, [e.target.name]: e.target.value }));
    };

    const isFormValid = () => {
        const requiredFields = ['logradouro', 'bairro', 'localidade', 'uf', 'numero'];
        return cep.length === 9 && requiredFields.every(field => !!address[field as keyof AddressType]);
    };

    const handleFormSubmit = () => {
        if (isFormValid() && userInfo) {
            console.log(address);
            updateDocumentField(userInfo?.id, 'address', address);
            setEditingMode(false);
            setFormError('');
        } else {
            if (!isFormValid()) setFormError('Por favor, preencha todos os campos obrigatórios.');
            if (!userInfo) setFormError('Usuário deslogado!');
        }
    };

    return (
        <section className="flex flex-col w-full bg-white p-2 px-4 border-2 rounded gap-2">
            <p>Endereço de entrega</p>
            { !address.logradouro ? (
                <CepInput
                    cep={ cep }
                    handleCepChange={ handleCepChange }
                    handleCepSubmit={ () => handleCepSubmit(cep.replace('-', '')) }
                    loading={ loading }
                    error={ error }
                />
            ) : (
                <AddressForm
                    address={ address }
                    cep={ cep }
                    handleCepChange={ handleCepChange }
                    handleAddressChange={ handleAddressChange }
                    handleFormSubmit={ handleFormSubmit }
                    isFormValid={ isFormValid }
                    loading={ loading }
                    formError={ formError }
                />
            ) }
        </section>
    );
}
