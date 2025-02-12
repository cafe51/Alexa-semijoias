// app/admin/coupons/MobileCouponCard.tsx
'use client';
import React from 'react';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';

interface MobileCouponCardProps {
  coupon: CouponType & FireBaseDocument;
  onEdit: (coupon: CouponType & FireBaseDocument) => void;
  onDelete: (coupon: CouponType & FireBaseDocument) => void;
  onViewDetails: (coupon: CouponType & FireBaseDocument) => void;
}

const MobileCouponCard: React.FC<MobileCouponCardProps> = ({
    coupon,
    onEdit,
    onDelete,
    onViewDetails,
}) => {
    const valorField = () => {
        if (coupon.tipo === 'percentual') return coupon.valor + '%';
        if (coupon.tipo === 'fixo') return formatPrice(coupon.valor);
        if (coupon.tipo === 'freteGratis') return 'Frete Grátis';
    };

    return (
        <div
            className={ `relative border rounded p-4 h-40 cursor-pointer flex flex-col justify-between ${
                coupon.status === 'ativo' ? 'bg-white' : 'bg-gray-100 text-gray-500'
            }` }
            onClick={ () => onViewDetails(coupon) }
        >
            { /* Ícone de edição (canto superior esquerdo) */ }
            <div
                className="absolute top-2 left-2 z-10"
                onClick={ (e) => {
                    e.stopPropagation();
                    onEdit(coupon);
                } }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
            </div>
            { /* Ícone de exclusão (canto superior direito) */ }
            <div
                className="absolute top-2 right-2 z-10"
                onClick={ (e) => {
                    e.stopPropagation();
                    if (confirm('Tem certeza que deseja excluir este cupom?')) {
                        onDelete(coupon);
                    }
                } }
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={ 2 } d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            { /* Conteúdo do card */ }
            <div>
                <h3 className="font-bold text-lg text-center">{ coupon.codigo }</h3>
                <p className="text-sm text-gray-700 line-clamp-2">{ coupon.descricao }</p>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-sm font-semibold">{ valorField() }</span>
                <span className="text-xs text-gray-500">
                    { coupon.dataExpiracao.toDate().toLocaleDateString() }
                </span>
            </div>
        </div>
    );
};

export default MobileCouponCard;
