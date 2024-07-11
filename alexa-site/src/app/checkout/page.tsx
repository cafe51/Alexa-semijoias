// app/checkout/page.tsx

'use client';
import { useEffect, useState } from 'react';
import AddressSection from './AddressSection/AddressSection';
import { AddressType } from '../utils/types';
import { useUserInfo } from '../hooks/useUserInfo';
import AddressSectionFilled from './AddressSection/AddressSectionFilled';
import AccountSection from './AccountSection';
import DeliveryPriceSection from './DeliveryPriceSection/DeliveryPriceSection';
import PaymentSection from './PaymentSection/PaymentSection';
import ChoosePaymentOptionSection from './PaymentSection/ChoosePaymentOptionSection';
import DeliveryPriceSectionFilled from './DeliveryPriceSection/DeliveryPriceSectionFilled';

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
            { userInfo ? <AccountSection  cpf={ userInfo.cpf } email={ userInfo.email } telefone={ userInfo.tel } /> : '' }
            
            { 
                userInfo && userInfo.address
                    ?
                    <AddressSectionFilled address={ address } setAddress={ setAddress } editingMode={ editingMode } setEditingMode={ setEditingMode }/>
                    : 
                    <AddressSection address={ address } setAddress={ setAddress } setEditingMode={ setEditingMode }/>
            } 


            <DeliveryPriceSection />

            <DeliveryPriceSectionFilled />
            {
            /* <ChoosePaymentOptionSection /> 
            <PaymentSection /> */
            }
        </main>
    );
}

