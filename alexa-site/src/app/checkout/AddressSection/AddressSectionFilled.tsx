// app/checkout/AddressSection/AddressSectionFilled.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressType } from '@/app/utils/types';

interface AddressSectionFilledProps {
    address: AddressType;
    handleEditingAddressMode?: (mode: boolean) => void; 
}

export default function AddressSectionFilled({ address, handleEditingAddressMode  }: AddressSectionFilledProps) {
    return(

        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="secColor text-[#333333]">
                <CardTitle className="flex justify-between">
                    <span className="text-xl">ENDEREÇO</span>
                    {
                        handleEditingAddressMode &&
                        <p className='text-[#D4AF37] text-sm w-full text-end md:text-lg cursor-pointer' onClick={ () => handleEditingAddressMode(true) }>
                    Trocar endereço
                        </p> 
                    }
                </CardTitle>
    
            </CardHeader>
            <CardContent className="pt-4 md:text-lg">
                <div className='flex gap-2'>
                    <div>
                        <span>{ address.bairro }</span>                     <span> - </span>
                    </div>

                    <span>{ address.numero }</span>
                    <span>{ address.complemento }</span>
                </div>
                <div>
                    <span>{ address.logradouro }</span>
                    <span>{ address.referencia }</span>
                </div>

                <div className='flex flex-col gap-1'>
                    <div>
                        <span>{ address.cep }</span>
                    </div>
                    <div>
                        <span>{ address.localidade }</span>

                        <span> - </span>
                        <span>{ address.uf }</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}