// app/checkout/CouponSection.tsx
'use client';
import { useState } from 'react';
import { useCoupon } from '@/app/hooks/useCoupon';
import { FireBaseDocument, ProductCartType } from '@/app/utils/types';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CouponSectionProps {
    cartPrice: number;
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null
    fetchDeliveryOptions: () => void;
    resetSelectedDeliveryOption: () => void;
    hiddenPaymentSection: () => void;
    setCouponDiscount: (discount: number | 'freteGratis') => void;
    couponDiscount: number | 'freteGratis'
}

export default function CouponSection({ cartPrice, carrinho, fetchDeliveryOptions, resetSelectedDeliveryOption, hiddenPaymentSection, setCouponDiscount, couponDiscount }: CouponSectionProps) {
    const { userInfo } = useUserInfo();
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState('');
    const [textMessageColor, setTextMessageColor] = useState('bg-red-500');
    const { applyCoupon } = useCoupon();

    const resetDeliveryOption = () => {
        fetchDeliveryOptions();
        resetSelectedDeliveryOption();
        hiddenPaymentSection();
    };

    const onCouponApplied = (discount: number | 'freteGratis') => {
        if(discount === 'freteGratis' || discount > 0) resetDeliveryOption();
        setCouponDiscount(discount);
    };

    const handleApply = async() => {
        if (!couponCode || !carrinho) return;
        const result = await applyCoupon(couponCode.trim(), cartPrice, carrinho);
        if (result.valido) {
            setMessage('Cupom aplicado com sucesso!');
            setTextMessageColor('text-green-500');
            onCouponApplied(result.descontoAplicado || 0);
        } else {
            setMessage(result.mensagemErro || 'Erro ao aplicar cupom');
            setCouponDiscount(0);
        }
    };

    const handleRemove = () => {
        resetDeliveryOption();
        setCouponCode('');
        setMessage('');
        setCouponDiscount(0);
    };

    if (!userInfo) return null;

    return (
        <div className="p-4 border rounded mt-4 secColor border-[#F8C3D3] hidden">
            <div className='flex justify-between'>
                <Input 
                    type="text" 
                    placeholder="Seu cupom" 
                    value={ couponCode } 
                    onChange={ (e) => setCouponCode(e.target.value) } 
                    className="border text-lg text-center bg-white px-2 mr-2"
                    readOnly={ couponDiscount === 'freteGratis' || couponDiscount > 0 }
                />
                {
                    ((couponDiscount !== 'freteGratis' && couponDiscount > 0) || couponDiscount === 'freteGratis')
                        ? <Button onClick={ handleRemove } className="bg-red-500 text-white text-lg">Remover Cupom</Button>
                        : <Button onClick={ handleApply } className="bg-blue-500 text-white text-lg mr-2">Aplicar Cupom</Button>
                }

            </div>
            { message && <p className={ `mt-2 text-sm ${textMessageColor}` }>{ message }</p> }
        </div>
    );
}
