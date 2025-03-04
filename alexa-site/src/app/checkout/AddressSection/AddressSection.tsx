// app/checkout/AddressSection/AddressSection.tsx
import { useState } from 'react';
import fetchAddressFromCEP from '../../utils/fetchAddressFromCEP';
import { AddressType, UseCheckoutStateType } from '../../utils/types';
import { formatCep } from '../../utils/formatCep';
import AddressForm from './AddressForm';
import CepInput from './CepInput';
import { useCollection } from '@/app/hooks/useCollection';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import AddressSectionFilled from './AddressSectionFilled';
import AddressSectionPending from './AddressSectionPending';

interface AddressSectionProps {
    state: UseCheckoutStateType;
    handleAddressChange: (newAddress: AddressType) => void;
    handleEditingAddressMode: (mode: boolean) => void;
    resetSelectedDeliveryOption: () => void;
}

export default function AddressSection({ state: { address, editingAddressMode }, handleAddressChange, handleEditingAddressMode, resetSelectedDeliveryOption }: AddressSectionProps) {
    const { updateDocumentField } = useCollection('usuarios');
    const { userInfo } = useUserInfo();
    const [cep, setCep] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formError, setFormError] = useState('');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = formatCep(e.target.value);
        setCep(newCep);
        
        if (newCep === '') {
            // Resetar o formulário quando o CEP for apagado
            handleAddressChange({
                logradouro: '',
                bairro: '',
                localidade: '',
                uf: '',
                numero: '',
                complemento: '',
                referencia: '',
                cep: '',
                ddd: '',
                estado: '',
                gia: '',
                ibge: '',
                siafi: '',
                regiao: '',
                unidade: '',
            });
            setError('');
            return;
        }

        if (newCep.replace('-', '').length === 8) {
            handleCepSubmit(newCep.replace('-', ''));
        }
    };

    const handleCepSubmit = async(cepToFetch: string) => {
        setLoading(true);
        setError('');
        try {
            const fetchedAddress = await fetchAddressFromCEP(cepToFetch);
            handleAddressChange({ ...fetchedAddress, referencia: '', numero: '' });
            setCep(formatCep(cepToFetch));
        } catch {
            // Resetar o formulário quando o CEP for inválido
            handleAddressChange({
                logradouro: '',
                bairro: '',
                localidade: '',
                uf: '',
                numero: '',
                complemento: '',
                referencia: '',
                cep: '',
                ddd: '',
                estado: '',
                gia: '',
                ibge: '',
                siafi: '',
                regiao: '',
                unidade: '',
            });
            setError('CEP inválido ou não encontrado.');
        } finally {
            setLoading(false);
        }
    };

    const handleStateAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleAddressChange({ ...address, [name]: value });
    };

    const isFormValid = () => {
        const requiredFields = ['logradouro', 'bairro', 'localidade', 'uf', 'numero'];
        return cep.length === 9 && requiredFields.every(field => !!address[field as keyof AddressType]);
    };

    const handleFormSubmit = () => {
        if (isFormValid() && userInfo) {
            console.log(address);
            updateDocumentField(userInfo?.id, 'address', address);
            resetSelectedDeliveryOption();
            handleEditingAddressMode(false);
            setFormError('');
        } else {
            if (!isFormValid()) setFormError('Por favor, preencha todos os campos obrigatórios.');
            if (!userInfo) setFormError('Usuário deslogado!');
        }
    };

    if (!userInfo) return <AddressSectionPending />;

    if(editingAddressMode){
        return (
            <section className="flex flex-col w-full bg-white p-2 px-4 border-2 rounded gap-2">
                <p>Endereço de entrega</p>
                { !address.logradouro ? (
                    <CepInput
                        cep={ cep }
                        handleCepChange={ handleCepChange }
                        loading={ loading }
                        isFormValid={ isFormValid() }
                        error={ error }
                    />
                ) : (
                    <AddressForm
                        address={ address }
                        cep={ cep }
                        handleCepChange={ handleCepChange }
                        handleStateAddressChange={ handleStateAddressChange }
                        handleFormSubmit={ handleFormSubmit }
                        isFormValid={ isFormValid }
                        loading={ loading }
                        formError={ formError }
                    />
                ) }
            </section>
        );
    }
    return (
        <AddressSectionFilled 
            address={ address } 
            handleEditingAddressMode={ handleEditingAddressMode } 
        />
    );
}
