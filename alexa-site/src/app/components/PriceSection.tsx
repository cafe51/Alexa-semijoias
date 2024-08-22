import LargeButton from './LargeButton';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import Price from './Price';

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
                color='green'
                onClick={ handleClick }
                loadingButton={ isLoadingButton }
                disabled={ isDisabled() }
            >
            COMPRE JÁ
            </LargeButton>
        </section>
    );
}