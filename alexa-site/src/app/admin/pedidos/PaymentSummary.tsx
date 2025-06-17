// src/components/PaymentSummary.tsx
import React from 'react';
import { CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/app/utils/formatPrice';

interface PaymentSummaryProps {
  subtotalPrice: number | undefined;
  frete: number | undefined;
  paymentOption: string;
  installments: number | undefined | null;
  coupon: string | null | undefined
}


const PaymentSummary: React.FC<PaymentSummaryProps> = ({ subtotalPrice, frete, paymentOption, installments, coupon }) => {
    return (
        <Card className="border-[#F8C3D3] shadow-md rounded">
            <CardHeader className="bg-[#F8C3D3] text-[#333333]">
                <CardTitle className="text-lg flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
          Resumo do Pagamento
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span> { subtotalPrice && subtotalPrice > 0 ? formatPrice(subtotalPrice) : '--' }</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Frete:</span>
                    <span>{ frete ? formatPrice(frete) : '--' }</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold mb-2">
                    <span>Total:</span>
                    <span>
                        {
                            subtotalPrice && subtotalPrice > 0 
                                ?
                                formatPrice(subtotalPrice + (frete ? frete : 0))
                                :
                                '--'
                        }
                    </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                    <p>Método de pagamento: { paymentOption }</p>
                    {
                        coupon && <p>Cupom: <span className='font-bold'>{ coupon }</span></p>

                    }
                    {
                        (paymentOption.toLowerCase() !== 'pix')
                        &&
                        (<p>{ installments }x de <span className='font-bold'>{ formatPrice(((subtotalPrice || 0) + (frete || 0)) / (installments || 0)) }</span></p>)
                    }
                </div>
            </CardContent>
        </Card>
    );
};

export default PaymentSummary;