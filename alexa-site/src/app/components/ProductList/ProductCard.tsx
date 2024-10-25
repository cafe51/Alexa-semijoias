import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { formatPrice } from '@/app/utils/formatPrice';
import FinishBuyConfirmationModal from '../FinishBuyConfirmationModal';
import ModalMaker from '../ModalMakers/ModalMaker';
import DynamicObjectCards from './VariationSelection/DynamicObjectCards';
import blankImage from '../../../../public/blankImage.png';
import { ImSpinner9 } from 'react-icons/im';
import Image from 'next/image';
import Link from 'next/link';

const calculateDiscount = (original: number, promotional: number) => {
    return Math.round(((original - promotional) / original) * 100);
};

export default function ProductCard({ product }: { product: ProductBundleType & FireBaseDocument; }) { 
    const displayPrice = product.value.promotionalPrice || product.value.price;
    const installmentValue = displayPrice / 6;
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
        }
    };

    return (
        <Card className="flex flex-col h-full overflow-hidden transition-shadow duration-300 hover:shadow-lg border-[#F8C3D3] shadow-md shadow-[#F8C3D3] border-none rounded-lg">
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

            <CardContent className="p-0 flex flex-col h-full">
                <Link href={ `/product/${product.id}` } className='relative aspect-square'>
                    <Image
                        data-testid="product-link"
                        className='rounded-lg rounded-b-none object-cover scale-100'
                        src={ product.images && product.images[0] ? product?.images[0].localUrl : blankImage.src }
                        alt="Foto da peça"
                        sizes="2200px"
                        priority
                        fill
                    />
                    <div className="absolute top-2 left-2 right-2 flex justify-between">
                        { product.lancamento && (
                            <Badge className="bg-[#C48B9F] text-white text-xs sm:text-sm md:text-base lg:text-lg">
                        Lançamento
                            </Badge>
                        ) }
                        { product.value.promotionalPrice > 0 && (
                            <Badge className="bg-[#F8C3D3] text-[#333333] text-xs sm:text-sm md:text-base lg:text-lg ml-auto">
                        -{ calculateDiscount(product.value.price, product.value.promotionalPrice) }%
                            </Badge>
                        ) }
                    </div>
                </Link>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 text-[#333333] line-clamp-2">
                        { product.name }
                    </h3>

                    <div className="flex flex-col mb-3 flex-grow">
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#D4AF37]">
                                { formatPrice(displayPrice) }
                            </span>
                            { product.value.promotionalPrice > 0 && (
                                <span className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-500 line-through">
                                    { formatPrice(product.value.price) }
                                </span>
                            ) }
                        </div>

                        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 mt-1">
                    ou até 6x de <span className="font-semibold text-base sm:text-lg md:text-xl lg:text-2xl text-[#C48B9F]">{ formatPrice(installmentValue) }</span> sem juros
                        </p>
                    </div>

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
                </div>
            </CardContent>
        </Card>

    );
}
