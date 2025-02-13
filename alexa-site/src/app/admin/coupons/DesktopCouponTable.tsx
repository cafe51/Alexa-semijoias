// app/admin/coupons/DesktopCouponTable.tsx
'use client';
import React from 'react';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';

interface DesktopCouponTableProps {
  coupons: (CouponType & FireBaseDocument)[];
  onEdit: (coupon: CouponType & FireBaseDocument) => void;
  onDelete: (coupon: CouponType & FireBaseDocument) => void;
}

const DesktopCouponTable: React.FC<DesktopCouponTableProps> = ({ coupons, onEdit, onDelete }) => {
    const valorField = (coupon: CouponType & FireBaseDocument) => {
        if (coupon.tipo === 'percentual') return coupon.valor + '%';
        if (coupon.tipo === 'fixo') return formatPrice(coupon.valor);
        if (coupon.tipo === 'freteGratis') return 'Frete Grátis';
    };

    return (
        <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 border">Código</th>
                    <th className="px-4 py-2 border">Descrição</th>
                    <th className="px-4 py-2 border">Valor</th>
                    <th className="px-4 py-2 border">Validade</th>
                    <th className="px-4 py-2 border">Quantidade</th>
                    <th className="px-4 py-2 border">Limite</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Ações</th>
                </tr>
            </thead>
            <tbody>
                { coupons.map((coupon) => {
                    const isExpired = coupon.dataExpiracao.toDate() < new Date();
                    const rowClass = (coupon.status === 'ativo' && !isExpired) ? 'bg-white' : 'bg-gray-100 text-gray-500';
                    const couponDataExpiracao = () => {
                        if(isExpired) {
                            return 'Expirado';
                        }
                        return coupon.dataExpiracao.toDate().toLocaleDateString();
                    };
                    const couponStatus = () => {
                        if(coupon.status === 'desativado') {
                            return 'Desativado';
                        }
                        if(isExpired) {
                            return 'Expirado';
                        }
                        return coupon.status;
                    };
                    return (
                        <tr key={ coupon.id } className={ `text-center ${rowClass}` }>
                            <td className="px-4 py-2 border">{ coupon.codigo }</td>
                            <td className="px-4 py-2 border">{ coupon.descricao }</td>
                            <td className="px-4 py-2 border">{ valorField(coupon) }</td>
                            <td className="px-4 py-2 border">
                                { couponDataExpiracao() }
                            </td>
                            <td className="px-4 py-2 border">
                                { coupon.limiteUsoGlobal ?? 'Infinitos' }
                            </td>
                            <td className="px-4 py-2 border">
                                { coupon.limiteUsoPorUsuario ?? 'Ilimitado' }
                            </td>
                            <td className="px-4 py-2 border capitalize">{ couponStatus() }</td>
                            <td className="px-4 py-2 border space-x-2">
                                <button
                                    onClick={ () => onEdit(coupon) }
                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={ () => {
                                        if (confirm('Tem certeza que deseja excluir este cupom?')) {
                                            onDelete(coupon);
                                        }
                                    } }
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    );
                }) }
            </tbody>
        </table>
    );
};

export default DesktopCouponTable;
