import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';


const calculateDiscount = (original: number, promotional: number) => {
    return Math.round(((original - promotional) / original) * 100);
};

export default function ProductCardBadges({ product }: { product: ProductBundleType & FireBaseDocument }) {
// Calcula o desconto, se houver preço promocional
    const discount = useMemo(() => {
        if (product.value.promotionalPrice > 0 && product.value.price > 0) {
            return calculateDiscount(product.value.price, product.value.promotionalPrice);
        }
        return null;
    }, [product.value.price, product.value.promotionalPrice]);

    return (
        <div className="absolute top-2 left-2 right-2 flex justify-between">
            { product.lancamento && (
                <Badge className="bg-[#F8C3D3] text-[#1E1E1E] text-xs sm:text-sm md:text-base lg:text-lg hover:bg-[#D4AF37] hover:text-white tracking-wide">
                Lançamento
                </Badge>
            ) }
            { product.value.promotionalPrice > 0 && discount !== null && (
                <Badge className="bg-[#F8C3D3] text-[#1E1E1E] hover:bg-[#D4AF37] hover:text-white text-xs sm:text-sm md:text-base lg:text-lg ml-auto tracking-widest">
                -{ discount }%
                </Badge>
            ) }
        </div>
    );
}