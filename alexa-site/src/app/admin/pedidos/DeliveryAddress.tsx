// src/components/DeliveryAddress.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AddressType } from '@/app/utils/types';

interface DeliveryAddressProps {
  address: AddressType;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({ address }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333]">
                <CardTitle className="text-lg flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
          Endereço de Entrega
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <p>{ address.logradouro } - <span>{ address.numero }</span></p>
                <p>{ address.bairro }, { address.localidade }, { address.uf }</p>
                <p>{ address.cep }</p>
            </CardContent>
        </Card>
    );
};

export default DeliveryAddress;