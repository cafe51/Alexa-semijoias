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
                <section className='flex flex-col w-full bg-white p-2 border-2 rounded px-6'>
                    <div className='flex justify-between'>
                        <p className="font-bold">ENDEREÇO DE ENTREGA</p>
                        <p
                            className='text-blue-400'
                            onClick={ () => setEditingMode(true) }
                        >
                            editar
                        </p>
                    </div>
                    <div className='flex flex-col p-2'>
                        <span>{ address.cep }</span>
                        <span>{ address.bairro }</span>
                        <div className='flex justify-between'>
                            <span>{ address.numero }</span>
                            <span>{ address.complemento }</span>
                        </div>
                        <span>{ address.localidade }</span>
                        <span>{ address.logradouro }</span>
                        <span>{ address.referencia }</span>
                    </div>

                </section>
            )
    );
}