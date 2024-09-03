//app/components/Card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useUserInfo } from '../../hooks/useUserInfo';
import formatPrice from '../../utils/formatPrice';
import SmallButton from '.././SmallButton';
import { useState } from 'react';
import { FireBaseDocument, ProductBundleType } from '../../utils/types';
import { useAddNewItemCart } from '../../hooks/useAddNewItemCart';
import blankImage from '../../../../public/blankImage.jpg';
import ModalMaker from '../ModalMakers/ModalMaker';
import DynamicObjectCards from './DynamicObjectCards';
import FinishBuyConfirmationModal from '../FinishBuyConfirmationModal';

interface CardProps {
    productData: ProductBundleType & FireBaseDocument | null;
}

export default function Card({ productData }: CardProps) {
    const  [isLoadingButton, setIsloadingButton ] = useState(false);
    const { carrinho } = useUserInfo();
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalOptionsVariation, setShowModalOptionsVariation] = useState(false);
    const [showModalFinishBuy, setShowModalFinishBuy] = useState(false);


    if (!productData) return <h3>Carregando...</h3>;
    
    const isDisabled = () => {
        if(productData) {
            const cartItems = carrinho?.filter((item) => item.productId === productData.id);

            if(cartItems) {
                if(cartItems.length > 1) {
                    let totalQuantityCart = 0;
                    for (const cartItem of cartItems) totalQuantityCart += cartItem.quantidade;
    
                    return productData.estoqueTotal <= totalQuantityCart;
                }
                if(cartItems.length === 1) {
                    return productData.estoqueTotal <= cartItems[0].quantidade;
                }
            } else {
                return false;
            }
        }
    };

    const handleClickButtonBuyNow = () => {
        if(productData.productVariations.length > 1){
            setShowModalOptionsVariation(!showModalOptionsVariation);
        } else {
            handleAddToCart(carrinho, productData.productVariations[0], setIsloadingButton);
        }
    };

    return (
        <div className='flex flex-col text-center w-[160px] justify-between content-between place-content-between gap-2 shadowColor shadow-lg text-[12px] rounded-lg bg-white'>
            { showModalFinishBuy && <FinishBuyConfirmationModal closeModelClick={ () => setShowModalFinishBuy(!showModalFinishBuy) } /> }
            
            {
                showModalOptionsVariation && <ModalMaker closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) } title='Escolha a variação'>
                    <section>
                        {
                            <DynamicObjectCards
                                // objects={ productData.productVariations.map((productVariation) => productVariation.customProperties) }
                                object={ productData }
                                carrinho={ carrinho }
                                handleAddToCart={ handleAddToCart }
                                setIsloadingButton={ setIsloadingButton }
                                closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) }
                                closeModalFinishBuyClick={ () => setShowModalFinishBuy(!showModalFinishBuy) }
                                isLoadingButton={ isLoadingButton }
                            />
                        }
                    </section>
                </ModalMaker>
            }
            <section className='flex flex-col w-full'>
                <Link href={ `/product/${productData.id}` } className='w-full rounded-lg relative h-[200px] overflow-hidden'>
                    <Image
                        data-testid="product-link"
                        className='rounded-lg object-cover scale-125'
                        src={ productData.images && productData.images[0] ? productData?.images[0].localUrl : blankImage.src }
                        alt="Foto da peça"
                        fill
                    />
                </Link>

                <div>
                    <h3 className='p-2 w-full'>{ productData.name }</h3>
                </div>

            </section>

            <section className="flex flex-col w-full p-4 ">
                {
                    productData.value.promotionalPrice > 0 &&
                        <p className='font-bold text-lg text-gray-400 text-decoration: line-through'>{ formatPrice(productData.value.price) }</p>
                }
                <div>
                    <p className='font-bold text-lg '>{ formatPrice(productData.value.promotionalPrice > 0 ? productData.value.promotionalPrice : productData.value.price) }</p>
                    <p>em até 6x de</p>
                    <p className='font-bold text-lg'>{ formatPrice((productData.value.promotionalPrice > 0 ? productData.value.promotionalPrice : productData.value.price)/ 6) }</p>
                    <p> sem juros</p>
                </div>
                <SmallButton  color='green' loadingButton={ isLoadingButton } disabled={ isDisabled() } onClick={ handleClickButtonBuyNow }>
                    COMPRAR
                </SmallButton> 

            </section>

        </div>
    );
}