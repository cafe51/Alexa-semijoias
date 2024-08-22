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
import ModalMaker from '.././ModalMaker';
import DynamicObjectCards from './DynamicObjectCards';
import LargeButton from '../LargeButton';

interface CardProps {
    productData: ProductBundleType & FireBaseDocument | null;
    sectionName: string;
}

export default function Card({ productData, sectionName }: CardProps) {
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
            // if(productData) {
            //     const cartItems = carrinho?.filter((item) => item.productId === productData.id);
            //     let totalQuantityCart = 0;
            //     if(cartItems) {
            //         for (const cartItem of cartItems) totalQuantityCart += cartItem.quantidade;
            //     }
            //     console.log('AAAAAAAAAAAAAA totalQuantityCart', totalQuantityCart);
            //     console.log('AAAAAAAAAAAAAA productData.estoqueTotal', productData.estoqueTotal);
            // }

            setShowModalOptionsVariation(!showModalOptionsVariation);
        } else {
            // if(productData) {
            //     const cartItems = carrinho?.filter((item) => item.productId === productData.id);
            //     let totalQuantityCart = 0;
            //     if(cartItems) {
            //         for (const cartItem of cartItems) totalQuantityCart += cartItem.quantidade;
            //     }
            //     console.log('AAAAAAAAAAAAAA totalQuantityCart', totalQuantityCart);
            //     console.log('AAAAAAAAAAAAAA productData.estoqueTotal', productData.estoqueTotal);
            // }
            handleAddToCart(carrinho, productData.productVariations[0], setIsloadingButton);
        }
    };

    return (
        <div className='flex flex-col text-center w-[160px] justify-between content-between place-content-between gap-2 shadowColor shadow-lg text-[12px] rounded-lg bg-white'>
            {
                showModalFinishBuy && <ModalMaker closeModelClick={ () => setShowModalFinishBuy(!showModalFinishBuy) } title='Produto Adicionado ao carrinho'>
                    <section className='flex flex-col gap-4 p-4'>
                        <h3>O que você deseja fazer agora?</h3>
                        <LargeButton color='green'>
                        Ir para o carrinho
                        </LargeButton>
                        <LargeButton color='green' onClick={ () =>  setShowModalFinishBuy(!showModalFinishBuy) }>
                        Continuar comprando
                        </LargeButton>
                    </section>
                </ModalMaker>
            }
            {
                showModalOptionsVariation && <ModalMaker closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) } title='Escolha a variação'>
                    <section>
                        <div>
                            {
                                <DynamicObjectCards
                                // objects={ productData.productVariations.map((productVariation) => productVariation.customProperties) }
                                    object={ productData }
                                    carrinho={ carrinho }
                                    handleAddToCart={ handleAddToCart }
                                    setIsloadingButton={ setIsloadingButton }
                                    closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) }
                                    closeModalFinishBuyClick={ () => setShowModalFinishBuy(!showModalFinishBuy) }
                                />
                            }
                        </div>
                    </section>
                </ModalMaker>
            }
            <section className='flex flex-col w-full'>
                <Link href={ `/${sectionName}/${productData.id}` } className='w-full rounded-lg relative h-[200px] overflow-hidden'>
                    <Image
                        data-testid="product-link"
                        className='rounded-lg object-cover scale-125'
                        src={ productData.images && productData.images[0] ? productData?.images[0] : blankImage }
                        // src='/../../../public/blankImage.jpg'
                        // src={ blankImage }

                        alt="Foto da peça"
                        fill
                    />
                </Link>

                <div>
                    <h3 className='p-2 w-full'>{ productData.name }</h3>
                </div>

            </section>

            <section className="flex flex-col w-full p-4 ">
                { /* <div className='p-2 w-full bg-yellow-200'>
                    <h3 >{ productData.id }</h3>
                </div> */ }
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