// app/checkout/AddressForm.tsx
'use client';
import { useState, useEffect } from 'react';
import fetchAddressFromCEP from '../utils/fetchAddressFromCEP';

export default function Address() {
    const [cep, setCep] = useState('');
    const [address, setAddress] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCep = e.target.value.slice(0, 8); // Limita o CEP a 8 caracteres
        setCep(newCep);
        if (newCep.length === 8) {
            handleCepSubmit(newCep);
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
            }
        } catch (error) {
            setError('CEP inválido ou não encontrado.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input) => {
            input.addEventListener('input', handleInput);
        });

        function handleInput(e: Event) {
            const target = e.target as HTMLInputElement;
            if (target.name) {
                setAddress((prevAddress) => ({
                    ...prevAddress,
                    [target.name]: target.value,
                }));
            }
        }

        return () => {
            inputs.forEach((input) => {
                input.removeEventListener('input', handleInput);
            });
        };
    }, []);

    return (
        <section className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded gap-2'>
            <p>Endereço de entrega</p>
            { !address.logradouro ? (
                <div className='flex flex-col w-full border-2 p-2 gap-2'>
                    <div className='relative mb-4'>
                        <input
                            type="text"
                            id="cep"
                            value={ cep }
                            onChange={ handleCepChange }
                            maxLength={ 8 }
                            className="w-full p-2 border rounded outline-none peer"
                        />
                        <label
                            htmlFor="cep"
                            className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                cep ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                            } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                        >
              CEP
                        </label>
                    </div>
                    <button
                        onClick={ () => handleCepSubmit(cep) }
                        disabled={ loading || cep.length !== 8 }
                        className='bg-yellow-300 p-2'
                    >
                        { loading ? 'Buscando...' : 'Buscar' }
                    </button>
                    { error && <p className='text-red-500 text-sm'>{ error }</p> }
                </div>
            ) : (
                <div className='flex flex-col p-2 w-full gap-2'>
                    <div className="flex w-full justify-between gap-4">
                        <div className='relative w-full'>
                            <input
                                type="text"
                                id="cep"
                                value={ cep }
                                onChange={ handleCepChange }
                                maxLength={ 8 }
                                className="border-4 p-2 w-full peer"
                            />
                            <label
                                htmlFor="cep"
                                className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                    cep ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                                } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                            >
                CEP
                            </label>
                        </div>
                        <div className="flex items-center">
                            <p>{ address.localidade } / { address.uf }</p>
                        </div>
                    </div>
                    <div className='relative mb-4'>
                        <input
                            type='text'
                            id="logradouro"
                            name="logradouro"
                            value={ address.logradouro }
                            readOnly
                            className="border-4 p-2 w-full peer"
                        />
                        <label
                            htmlFor="logradouro"
                            className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                address.logradouro ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                            } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                        >
              Rua
                        </label>
                    </div>
                    <div className="flex w-full justify-between gap-4">
                        <div className='relative mb-4 w-full'>
                            <input
                                type='text'
                                id="numero"
                                name="numero"
                                onChange={ handleAddressChange }
                                className="border-4 p-2 w-full peer"
                                value={ address.numero || '' }
                            />
                            <label
                                htmlFor="numero"
                                className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                    address.numero ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                                } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                            >
                Número
                            </label>
                        </div>
                        <div className='relative mb-4 w-full'>
                            <input
                                type='text'
                                id="complemento"
                                name="complemento"
                                onChange={ handleAddressChange }
                                className="border-4 p-2 w-full peer"
                                value={ address.complemento || '' }
                            />
                            <label
                                htmlFor="complemento"
                                className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                    address.complemento ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                                } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                            >
                Complemento
                            </label>
                        </div>
                    </div>
                    <div className='relative mb-4'>
                        <input
                            type='text'
                            id="bairro"
                            name="bairro"
                            value={ address.bairro }
                            readOnly
                            className="border-4 p-2 w-full peer"
                        />
                        <label
                            htmlFor="bairro"
                            className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                address.bairro ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                            } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                        >
              Bairro
                        </label>
                    </div>
                    <div className='relative mb-4'>
                        <input
                            type='text'
                            id="referencia"
                            name="referencia"
                            onChange={ handleAddressChange }
                            className="border-4 p-2 w-full peer"
                            value={ address.referencia || '' }
                        />
                        <label
                            htmlFor="referencia"
                            className={ `absolute left-2 text-gray-500 transition-all duration-200 ease-in-out ${
                                address.referencia ? '-top-2.5 text-xs bg-white px-1' : 'top-2 text-base'
                            } peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white peer-focus:px-1` }
                        >
              Referência
                        </label>
                    </div>
                    { error && <p className='text-red-500 text-sm'>{ error }</p> }
                    <button
                        onClick={ () => console.log(address) }
                        disabled={ loading }
                        className='bg-yellow-300 p-2'
                    >
            Mostrar Estado
                    </button>
                </div>
            ) }
        </section>
    );
}
