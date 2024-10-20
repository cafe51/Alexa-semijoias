import { Button } from '@/components/ui/button';
import { FireBaseDocument, ProductCartType, ProductVariation } from '../utils/types';
import { ShoppingCart } from 'lucide-react';

interface BuyNowButtonProps {
    productVariationsSelected: ProductVariation[];
    handleAddToCart: (
        (carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null,
        productData: ProductVariation | null,
        setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>,
        quantity?: number) => void);
    setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>;
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
    setShowModalFinishBuy: React.Dispatch<React.SetStateAction<boolean>>;
    showModalFinishBuy: boolean;
    quantity: number;
    isDisabled: () => boolean;
}

export default function BuyNowButton({
    productVariationsSelected,
    handleAddToCart,
    setIsloadingButton,
    carrinho,
    setShowModalFinishBuy,
    showModalFinishBuy,
    quantity,
    isDisabled,
}: BuyNowButtonProps) {
    return (
        <div className="my-6">
            <Button className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white text-sm md:text-base" disabled={ isDisabled() } onClick={ () => {
                productVariationsSelected.length === 1 && handleAddToCart(carrinho, productVariationsSelected[0], setIsloadingButton, quantity);
                setShowModalFinishBuy(!showModalFinishBuy);
            } }>
                <ShoppingCart className="mr-2 h-4 w-4" />
Adicionar ao Carrinho
            </Button>
        </div>
    );
}