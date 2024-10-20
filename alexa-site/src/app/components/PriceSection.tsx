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
}

export default function PriceSection({
    product,
    isLoadingButton,
    isDisabled,
    quantity,
    handleClick,
}: PriceSectionProps) {


    return (
        <section className='w-full p-2 border-solid border-2 border-x-0 borderColor'>
            <Price
                price={ product.value.price }
                promotionalPrice={ product.value.promotionalPrice }
                quantity={ quantity }
            />  
            <LargeButton
                color=' bg-[#D4AF37] hover:bg-[#C48B9F] text-white '
                onClick={ handleClick }
                loadingButton={ isLoadingButton }
                disabled={ isDisabled() }
            >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-6 md:w-6" />
            COMPRE JÁ
            </LargeButton>
        </section>
    );
}

