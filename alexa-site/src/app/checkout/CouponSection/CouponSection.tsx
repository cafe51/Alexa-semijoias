// app/checkout/CouponSection.tsx
'use client';
import { useState } from 'react';
import { useCoupon } from '@/app/hooks/useCoupon';
import { CouponType, FireBaseDocument, ProductCartType } from '@/app/utils/types';

interface CouponSectionProps {
  cartPrice: number;
  carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null
  onCouponApplied: (coupon: CouponType, discount: number) => void;
  onCouponRemoved: () => void;
}

export default function CouponSection({ cartPrice, carrinho, onCouponApplied, onCouponRemoved }: CouponSectionProps) {
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState('');
    const { applyCoupon } = useCoupon();

    const handleApply = async() => {
        if (!couponCode || !carrinho) return;
        const result = await applyCoupon(couponCode.trim(), cartPrice, carrinho);
        if (result.valido) {
            setMessage('Cupom aplicado com sucesso!');
            onCouponApplied(result.coupon!, result.descontoAplicado || 0);
        } else {
            setMessage(result.mensagemErro || 'Erro ao aplicar cupom');
            onCouponRemoved();
        }
    };

    const handleRemove = () => {
        setCouponCode('');
        setMessage('');
        onCouponRemoved();
    };

    return (
        <div className="coupon-section p-4 border rounded mt-4 hidden">
            <input 
                type="text" 
                placeholder="Digite seu cupom" 
                value={ couponCode } 
                onChange={ (e) => setCouponCode(e.target.value) } 
                className="border p-2 mr-2"
            />
            <button onClick={ handleApply } className="bg-blue-500 text-white p-2 mr-2">Aplicar Cupom</button>
            { couponCode && <button onClick={ handleRemove } className="bg-red-500 text-white p-2">Remover Cupom</button> }
            { message && <p className="mt-2 text-sm">{ message }</p> }
        </div>
    );
}
