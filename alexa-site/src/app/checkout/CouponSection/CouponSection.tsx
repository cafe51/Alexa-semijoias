// app/checkout/CouponSection.tsx
'use client';
import { useState } from 'react';
import { useCoupon } from '@/app/hooks/useCoupon';
import { FireBaseDocument, ProductCartType } from '@/app/utils/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { COUPONREVENDEDORAFIRSTCODE, COUPONREVENDEDORAVIP } from '@/app/utils/constants';

interface CouponSectionProps {
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null
    fetchDeliveryOptions: () => void;
    resetSelectedDeliveryOption: () => void;
    hiddenPaymentSection: () => void;
    setCouponDiscount: (discount: number | 'freteGratis') => void;
    couponDiscount: number | 'freteGratis'
    setCouponCode: (code: string) => void;
}

export default function CouponSection({
    carrinho,
    fetchDeliveryOptions,
    resetSelectedDeliveryOption,
    hiddenPaymentSection,
    setCouponDiscount,
    couponDiscount,
    setCouponCode,
}: CouponSectionProps) {
    const [message, setMessage] = useState('');
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [textMessageColor, setTextMessageColor] = useState('text-red-500');
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
        if (!couponCodeInput || !carrinho) return;
        const removePromotionalPriceCondition = (
            couponCodeInput.trim() === COUPONREVENDEDORAFIRSTCODE
            || couponCodeInput.trim() === COUPONREVENDEDORAVIP
            || couponCodeInput.trim() === 'MARLI15'
            || couponCodeInput.trim() === 'ALE15'
            || couponCodeInput.trim() === 'DUDA15'
            || couponCodeInput.trim() === 'DAIANE15'
            || couponCodeInput.trim() === 'LI15'
            || couponCodeInput.trim() === 'SUETE15'
            || couponCodeInput.trim() === 'FRAN15'
            || couponCodeInput.trim() === 'MAE15'




        );

        const cartToCouponGenerate = removePromotionalPriceCondition ? carrinho.map((item) => ({
            ...item,
            value: {
                ...item.value,
                promotionalPrice: 0,
            },
        })) : carrinho;
        const cartPrice = 
            Number(cartToCouponGenerate
                ?.map((items) => (Number(items.quantidade) * (items.value.promotionalPrice ? items.value.promotionalPrice : items.value.price)))
                .reduce((a, b) => a + b, 0));
        
        const result = await applyCoupon(couponCodeInput.trim(), cartPrice, cartToCouponGenerate);
        if (result.valido) {
            console.log('result', result);
            console.log(carrinho);
            setCouponCode(couponCodeInput);
            setMessage('Cupom aplicado com sucesso!');
            setTextMessageColor('text-green-500');
            onCouponApplied(result.descontoAplicado || 0);
        } else {
            setMessage(result.mensagemErro || 'Erro ao aplicar cupom');
            setTextMessageColor('text-red-500');
            setCouponDiscount(0);
        }
    };

    const handleRemove = () => {
        resetDeliveryOption();
        setCouponCode('');
        setCouponCodeInput('');
        setMessage('');
        setCouponDiscount(0);
    };

    return (
        <div className="p-4 border rounded mt-4 secColor border-[#F8C3D3]">
            <div className='flex justify-between'>
                <Input 
                    type="text" 
                    placeholder="Seu cupom" 
                    value={ couponCodeInput } 
                    onChange={ (e) => setCouponCodeInput(e.target.value) } 
                    className="border text-lg text-center bg-white px-2 mr-2"
                    readOnly={ couponDiscount === 'freteGratis' || couponDiscount > 0 }
                />
                {
                    ((couponDiscount !== 'freteGratis' && couponDiscount > 0) || couponDiscount === 'freteGratis')
                        ? <Button onClick={ handleRemove } className="bg-red-500 text-white text-lg">Remover</Button>
                        : <Button onClick={ handleApply } className=" bg-[#D4AF37] hover:bg-[#C48B9F] text-white text-base md:text-lg lg:text-xl py-0 ">Aplicar</Button>
                }

            </div>
            { message && <p className={ `mt-2 text-sm ${textMessageColor}` }>{ message }</p> }
        </div>
    );
}
