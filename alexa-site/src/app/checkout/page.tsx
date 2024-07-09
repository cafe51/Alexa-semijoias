// app/checkout/page.tsx

'use client';
import { useState } from 'react';
import AddressSection from './AddressSection';
import { AddressType } from '../utils/types';

export default function Checkout(){
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

            <AddressSection address={ address } setAddress={ setAddress }/>

            <section className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'>
                <p>Forma de Entrega</p>
            </section>

            <section className='flex flex-col w-full bg-white p-2 px-4 border-2 rounded'>
                <p>Pagamento</p>
            </section>


        </main>
    );
}