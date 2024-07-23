// app/checkout/AddressSection/AddressSectionFilled.tsx
import { AddressType } from '@/app/utils/types';

interface AddressSectionFilledProps {
    address: AddressType;
    handleEditingAddressMode?: (mode: boolean) => void; 
}

export default function AddressSectionFilled({ address, handleEditingAddressMode  }: AddressSectionFilledProps) {
    return(
        <section className='flex flex-col w-full bg-green-50 border-green-200 p-2 border-2 rounded-lg px-6'>
            <div className='flex justify-between w-full'>
                <p className="font-bold">ENDEREÇO</p>
                {
                    handleEditingAddressMode
                        ?
                        <p
                            className='text-blue-400 text-sm w-full text-end'
                            onClick={ () => handleEditingAddressMode(true) }
                        >
                            Trocar endereço
                        </p>
                        :
                        ''
                }
               
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
    );
}