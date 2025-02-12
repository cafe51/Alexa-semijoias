// app/admin/coupons/MobileCouponList.tsx
'use client';
import React from 'react';
import { CouponType, FireBaseDocument } from '@/app/utils/types';
import MobileCouponCard from './MobileCouponCard';

interface MobileCouponListProps {
  coupons: (CouponType & FireBaseDocument)[];
  onEdit: (coupon: CouponType & FireBaseDocument) => void;
  onDelete: (coupon: CouponType & FireBaseDocument) => void;
  onViewDetails: (coupon: CouponType & FireBaseDocument) => void;
}

const MobileCouponList: React.FC<MobileCouponListProps> = ({
    coupons,
    onEdit,
    onDelete,
    onViewDetails,
}) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            { coupons.map((coupon) => (
                <MobileCouponCard
                    key={ coupon.id }
                    coupon={ coupon }
                    onEdit={ onEdit }
                    onDelete={ onDelete }
                    onViewDetails={ onViewDetails }
                />
            )) }
        </div>
    );
};

export default MobileCouponList;
