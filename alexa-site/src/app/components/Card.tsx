//app/components/Card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useUserInfo } from '../hooks/useUserInfo';
import formatPrice from '../utils/formatPrice';
import SmallButton from './SmallButton';
import { Dispatch, SetStateAction, useState } from 'react';
import { CartInfoType, ProductBundleType, ProductCartType, ProductVariation } from '../utils/types';
import { useAddNewItemCart } from '../hooks/useAddNewItemCart';
import { DocumentData, WithFieldValue } from 'firebase/firestore';
import ModalMaker from './ModalMaker';

interface DynamicObjectCardsProps {
    object: ProductBundleType,
    handleAddToCart: (carrinho: (CartInfoType & WithFieldValue<DocumentData>)[] | null, productData: (ProductVariation & WithFieldValue<DocumentData>) | null, setIsloadingButton: Dispatch<SetStateAction<boolean>>) => void
    carrinho: ProductCartType[] | null;
    setIsloadingButton: () => void;
}


function DynamicObjectCards({ object, handleAddToCart, carrinho, setIsloadingButton }: DynamicObjectCardsProps) {
    function isString(value: unknown): value is string {
        return typeof value === 'string';
    }

    return (
        <div>
            { object.productVariations.map((productVariation, index) => (
                <div
                    key={ index }
                    className="p-4 border-solid border-2 border-black  hover:bg-slate-500"
                    onClick={ () => {
                        console.log(productVariation);
                        handleAddToCart(carrinho, productVariation, setIsloadingButton);
                    } }
                >
                    { Object.entries(productVariation.customProperties).map(([key, value]) => (
                        <div key={ key } className="flex gap-2">
                            <span>{ key }</span>
                            <span>{ isString(value) ? value : 'Value not a string' }</span>
                        </div>
                    )) }
                </div>
            )) }
        </div>
    );
}


interface CardProps {
    productData: ProductBundleType & DocumentData | null;
    sectionName: string;
}

export default function Card({ productData, sectionName }: CardProps) {
    const  [isLoadingButton, setIsloadingButton ] = useState(false);
    const { carrinho } = useUserInfo();
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalOptionsVariation, setShowModalOptionsVariation] = useState(false);

    if (!productData) return <h3>Carregando...</h3>;
    
    const isDisabled = () => {
        // if(productData.estoque) {
        //     const cartItem = carrinho?.find((item) => item.productId === productData.id);
        //     return cartItem ? cartItem.quantidade >= productData.estoque : false;
        // }
        return false;
    };

    const handleClickButtonBuyNow = () => {
        if(productData.variations){
            setShowModalOptionsVariation(!showModalOptionsVariation);
        } else {
            // handleAddToCart(carrinho, productData.productVariations[0], setIsloadingButton)
        }
    };

    return (
        <div className='flex flex-col text-center w-[160px] justify-between content-between place-content-between gap-2 shadowColor shadow-lg text-[12px] rounded-lg bg-white'>
            { showModalOptionsVariation &&<ModalMaker closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) } title='Escolha a variação'>
                <section>
                    <div>
                        {
                            <DynamicObjectCards
                                // objects={ productData.productVariations.map((productVariation) => productVariation.customProperties) }
                                object={ productData }
                                carrinho={ carrinho }
                                handleAddToCart={ handleAddToCart }
                                setIsloadingButton={ () => setIsloadingButton(!isLoadingButton) }
                            />
                        }
                    </div>
                </section>
            </ModalMaker> }
            <section className='flex flex-col w-full'>
                <Link href={ `/${sectionName}/${productData.id}` } className='w-full rounded-lg relative h-[200px] overflow-hidden'>
                    <Image
                        data-testid="product-link"
                        className='rounded-lg object-cover scale-125'
                        src={ 'https://cdn.dooca.store/69773/products/anel-organico-regulavel-folheado-em-ouro-18k1_1600x2000+fill_ffffff.jpg?v=1712695670' }
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