// src/app/components/PriceSection.tsx
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Price from './Price';
import { ShoppingCart } from 'lucide-react';
import LargeButton from './LargeButton';


interface PriceSectionProps {
    product: (ProductBundleType & FireBaseDocument);
    isLoadingButton: boolean;
    isDisabled: () => boolean;
    quantity: number;
    handleClick: () => void;
    setShowTooltip?: (showTooltip: boolean) => void;
}

export default function PriceSection({
    product,
    isLoadingButton,
    isDisabled,
    quantity,
    handleClick,
    setShowTooltip,
}: PriceSectionProps) {

    const handleAddToCartClick = () => {
        if (isDisabled()) {
            setShowTooltip && setShowTooltip(true);
            return;
        }
        handleClick();
        setShowTooltip && setShowTooltip(false);
    };

    return (
        <section className='w-full  p-2  relative'>
            <Price
                price={ product.value.price }
                promotionalPrice={ product.value.promotionalPrice }
                quantity={ quantity }
            />

            {
                product.estoqueTotal <= 0 &&
                <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
                    <p className="text-xl text-center font-bold text-red-500 my-2">Produto indisponível no momento</p>
                    <p className="text-center text-gray-600 mt-2">
    Este item está esgotado, mas estamos trabalhando para repor o estoque.
                    </p>
                </div>
            }

            <LargeButton
                color=' bg-[#D4AF37] hover:bg-[#C48B9F] text-white '
                onClick={ handleAddToCartClick }
                loadingButton={ isLoadingButton }
            >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-6 md:w-6" />
            COMPRE JÁ
            </LargeButton>
        </section>
    );
}
