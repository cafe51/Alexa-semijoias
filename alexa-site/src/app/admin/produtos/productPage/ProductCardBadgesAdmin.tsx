import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';


const calculateDiscount = (original: number, promotional: number) => {
    return Math.round(((original - promotional) / original) * 100);
};

export default function ProductCardBadgesAdmin({ product }: { product: ProductBundleType & FireBaseDocument }) {
// Calcula o desconto, se houver preço promocional
    const discount = useMemo(() => {
        if (product.value.promotionalPrice > 0 && product.value.price > 0) {
            return calculateDiscount(product.value.price, product.value.promotionalPrice);
        }
        return null;
    }, [product.value.price, product.value.promotionalPrice]);

    return (
        <div className="absolute top-2 left-0 right-0 flex justify-between">
            { product.lancamento && (
                <Badge className="bg-[#7dd4c9] text-white text-xs sm:text-sm md:text-base lg:text-lg w-fit">
                L
                </Badge>
            ) }
            { product.value.promotionalPrice > 0 && discount !== null && (
                <Badge className="bg-[#F8C3D3] text-[#333333] text-xs sm:text-sm md:text-base lg:text-lg ml-auto w-fit">
                -{ discount }%
                </Badge>
            ) }
        </div>
    );
}