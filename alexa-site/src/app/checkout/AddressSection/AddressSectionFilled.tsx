// app/checkout/AddressSection/AddressSectionFilled.tsx

import { AddressType } from '@/app/utils/types';
import AddressSection from './AddressSection';
import { Dispatch, SetStateAction } from 'react';

interface AddressSectionFilledProps {
    address: AddressType;
    editingMode: boolean;
    setAddress: Dispatch<SetStateAction<AddressType>>;
    setEditingMode: Dispatch<SetStateAction<boolean>>; 
}

export default function AddressSectionFilled({ address, setAddress, editingMode, setEditingMode  }: AddressSectionFilledProps) {


    console.log('AAAA', address);
    return(
        editingMode
            ?   (
                <AddressSection address={ address } setAddress={ setAddress } setEditingMode={ setEditingMode }/>
            )
            :
            (
                <section className='flex flex-col w-full bg-green-50 border-green-200 p-2 border-2 rounded-lg px-6'>
                    <div className='flex justify-between w-full'>
                        <p className="font-bold">ENDEREÇO</p>
                        <p
                            className='text-blue-400 text-sm w-full text-end'
                            onClick={ () => setEditingMode(true) }
                        >
                            Trocar endereço
                        </p>
                    </div>
                    <div className='flex flex-col p-2'>
                        <div className='flex gap-2'>
                            <span>{ address.bairro }</span>
                            <span> - </span>
                            <span>{ address.numero }</span>
                            <span>{ address.complemento }</span>
                        </div>

                        <span>{ address.logradouro }</span>
                        <span>{ address.referencia }</span>

                        <div className='flex gap-1'>
                            <span>{ address.cep }</span>
                            <span> - </span>
                            <span>{ address.localidade }</span>

                            <span> - </span>
                            <span>{ address.uf }</span>
                        </div>
                    </div>

                </section>
            )
    );
}