// src/components/CustomerInfo.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerInfoProps {
  name: string;
  email: string;
  phone: string;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ name, email, phone }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333]">
                <CardTitle className="text-lg">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <p className="font-semibold">{ name }</p>
                <p>{ email }</p>
                <p>{ phone }</p>
            </CardContent>
        </Card>
    );
};

export default CustomerInfo;