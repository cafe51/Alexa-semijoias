'use client';
import { Button } from '@/components/ui/button';
import ModalMaker from '../ModalMakers/ModalMaker';
import DynamicObjectCards from './VariationSelection/DynamicObjectCards';
import { useState } from 'react';
import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import FinishBuyConfirmationModal from '../FinishBuyConfirmationModal';
import { ImSpinner9 } from 'react-icons/im';
import { trackPixelEvent } from '@/app/utils/metaPixel';

export function BuyButtonOnCard({ product }: { product: ProductBundleType & FireBaseDocument; }) {
    const  [isLoadingButton, setIsloadingButton ] = useState(false);
    const { carrinho } = useUserInfo();
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalOptionsVariation, setShowModalOptionsVariation] = useState(false);
    const [showModalFinishBuy, setShowModalFinishBuy] = useState(false);

    const isDisabled = () => {
        if(product) {
            const cartItems = carrinho?.filter((item) => item.productId === product.id);

            if(cartItems) {
                if(cartItems.length > 1) {
                    let totalQuantityCart = 0;
                    for (const cartItem of cartItems) totalQuantityCart += cartItem.quantidade;
    
                    return product.estoqueTotal <= totalQuantityCart;
                }
                if(cartItems.length === 1) {
                    return product.estoqueTotal <= cartItems[0].quantidade;
                }
            } else {
                return false;
            }
        }
    };

    const handleClickButtonBuyNow = () => {
        if(product.productVariations.length > 1){
            setShowModalOptionsVariation(!showModalOptionsVariation);
        } else {
            handleAddToCart(carrinho, product.productVariations[0], setIsloadingButton);
            trackPixelEvent('AddToCart', {
                content_type: 'product',
                content_ids: [product.id],
                content_name: product.name,
                content_category: product.sections[0],
                value: (product.value.promotionalPrice ? product.value.promotionalPrice : product.value.price) * 1,
                currency: 'BRL',
                contents: [{
                    id: product.id,
                    quantity: 1,
                }],
            });
                    
            setShowModalFinishBuy(prev => !prev);
        }
    };

    return (
        <>
            { showModalFinishBuy && <FinishBuyConfirmationModal closeModelClick={ () => setShowModalFinishBuy(!showModalFinishBuy) } /> }
    
            { showModalOptionsVariation && (
                <ModalMaker closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) } title='Escolha a variação'>
                    <section>
                        <DynamicObjectCards
                            object={ product }
                            carrinho={ carrinho }
                            handleAddToCart={ handleAddToCart }
                            setIsloadingButton={ setIsloadingButton }
                            closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) }
                            closeModalFinishBuyClick={ () => setShowModalFinishBuy(!showModalFinishBuy) }
                            isLoadingButton={ isLoadingButton }
                        />
                    </section>
                </ModalMaker>
            ) }
            <Button
                className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg lg:text-xl"
                onClick={ handleClickButtonBuyNow }
                disabled={ isDisabled() }
            >
                { isLoadingButton
                    ? (
                        <ImSpinner9 className="text-gray-500 animate-spin" />
                    )
                    : (
                        'COMPRAR'
                    ) }
            </Button>
        </>
    );
}
                    