// app/admin/coupons/MobileCouponDetails.tsx
'use client';
import React, { useState } from 'react';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';
import ToggleSwitch from '../components/ToggleSwitch';

interface MobileCouponDetailsProps {
  coupon: CouponType & FireBaseDocument;
  onStatusToggle: (newStatus: 'ativo' | 'desativado') => void;
}

const MobileCouponDetails: React.FC<MobileCouponDetailsProps> = ({ coupon, onStatusToggle }) => {
    const [localStatus, setLocalStatus] = useState<'ativo' | 'desativado'>(coupon.status as 'ativo' | 'desativado');

    const toggleStatus = async() => {
        const newStatus = localStatus === 'ativo' ? 'desativado' : 'ativo';
        await onStatusToggle(newStatus);
        setLocalStatus(newStatus);
    };

    const valorField = () => {
        if (coupon.tipo === 'percentual') return coupon.valor + '%';
        if (coupon.tipo === 'fixo') return formatPrice(coupon.valor);
        if (coupon.tipo === 'freteGratis') return 'Frete Grátis';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-2xl font-bold text-gray-900">{ coupon.codigo }</h2>
                <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-800">
                        { localStatus === 'ativo' ? 'Ativo' : 'Desativado' }
                    </span>
                    <ToggleSwitch checked={ localStatus === 'ativo' } onChange={ toggleStatus } />
                </div>
            </div>
            <div className="space-y-3">
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Descrição:</span> { coupon.descricao }
                </p>
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Tipo:</span> { coupon.tipo }
                </p>
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Valor:</span> { valorField() }
                </p>
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Data de Início:</span>{ ' ' }
                    { coupon.dataInicio.toDate().toLocaleDateString() }
                </p>
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Data de Expiração:</span>{ ' ' }
                    { coupon.dataExpiracao.toDate().toLocaleDateString() }
                </p>
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Quantidade:</span>{ ' ' }
                    { coupon.limiteUsoGlobal ?? 'Infinitos' }
                </p>
                <p className="text-base text-gray-700">
                    <span className="font-semibold">Limite por Usuário:</span>{ ' ' }
                    { coupon.limiteUsoPorUsuario ?? 'Ilimitado' }
                </p>
            </div>
            { coupon.condicoes && (
                <div className="border-t pt-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Condições</h3>
                    { coupon.condicoes.valorMinimoCompra !== undefined && (
                        <p className="text-base text-gray-700">
                            <span className="font-semibold">Valor Mínimo:</span>{ ' ' }
                            { coupon.condicoes.valorMinimoCompra }
                        </p>
                    ) }
                    <p className="text-base text-gray-700">
                        <span className="font-semibold">Texto:</span>{ ' ' }
                        { coupon.condicoes.textoExplicativo }
                    </p>
                    { coupon.condicoes.primeiraCompraApenas && (
                        <p className="text-base text-gray-700">
                            <span className="font-semibold">Primeira Compra Apenas:</span> Sim
                        </p>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default MobileCouponDetails;
