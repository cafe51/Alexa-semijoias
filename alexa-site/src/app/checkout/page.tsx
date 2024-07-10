// app/checkout/page.tsx

'use client';
import { useEffect, useState } from 'react';
import AddressSection from './AddressSection/AddressSection';
import { AddressType } from '../utils/types';
import { useUserInfo } from '../hooks/useUserInfo';
import AddressSectionFilled from './AddressSection/AddressSectionFilled';

export default function Checkout(){
    const [editingMode, setEditingMode] = useState(false);

    const { userInfo } = useUserInfo();
    const [address, setAddress] = useState<AddressType>(
        {
            bairro: '',
            cep: '',
            complemento: '',
            ddd: '',
            gia: '',
            ibge: '',
            localidade: '',
            logradouro: '',
            numero: '',
            siafi: '',
            uf: '',
            unidade: '',
            referencia: '',
        },
    );

    useEffect(() => {
        if(userInfo && userInfo.address) {
            setAddress(userInfo.address);
        }
    }, [userInfo]);

    return (
        <main className='flex flex-col w-full gap-2  br'>
            <section className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'>
                <div className='flex justify-between w-full '>
                    <p>Ver resumo</p>
                    <p>R$ 156,00</p>
                </div>
            </section>

            <section className='flex flex-col w-full bg-white p-2 border-2 rounded px-6'>
                <p className="font-bold">CONTA</p>
                <div className='flex flex-col p-2'>
                    <p>cafecafe51@hotmail.com</p>
                    <p>021.555.000.00</p>
                    <p>(92) 95555-5555</p>
                </div>
            </section>
            
            { 
                userInfo && userInfo.address
                    ?
                    <AddressSectionFilled address={ address } setAddress={ setAddress } editingMode={ editingMode } setEditingMode={ setEditingMode }/>
                    : 
                    <AddressSection address={ address } setAddress={ setAddress } setEditingMode={ setEditingMode }/>
            } 

            <section className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'>
                <p>Forma de Entrega</p>
            </section>

            <section className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'>
                <p>Pagamento</p>
            </section>


        </main>
    );
}

