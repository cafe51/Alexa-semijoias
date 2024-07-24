//app/components/Card.tsx
import Image from 'next/image';
import Link from 'next/link';
import { useUserInfo } from '../hooks/useUserInfo';
import formatPrice from '../utils/formatPrice';
import SmallButton from './SmallButton';
import { useState } from 'react';
import { ProductType } from '../utils/types';
import { useAddNewItemCart } from '../hooks/useAddNewItemCart';

export default function Card({ productData, productType }: { productData: ProductType | null, productType: string }) {
    const  [isLoadingButton, setIsloadingButton ] = useState(false);
    const { carrinho } = useUserInfo();
    const { handleAddToCart } = useAddNewItemCart(carrinho, productData, setIsloadingButton);

    if (!productData) return <h3>Carregando...</h3>;
    
    const isDisabled = () => {
        const cartItem = carrinho?.find((item) => item.productId === productData.id);
        return cartItem ? cartItem.quantidade >= productData.estoque : false;
    };

    return (
        <div className='flex flex-col text-center w-[160px] justify-between content-between place-content-between gap-2 shadowColor shadow-lg text-[12px] rounded-lg bg-white'>

            <section className='flex flex-col w-full'>
                <Link href={ `/${productType}/${productData.id}` } className='w-full rounded-lg relative h-[200px] overflow-hidden'>
                    <Image
                        data-testid="product-link"
                        className='rounded-lg object-cover scale-125'
                        src={ productData.image[0] }
                        alt="Foto da peça"
                        fill
                    />
                </Link>

                <div>
                    <h3 className='p-2 w-full'>{ productData.nome }</h3>
                </div>

            </section>

            <section className="flex flex-col w-full p-4 ">
                <div className='p-2 w-full bg-yellow-200'>
                    <h3 >{ productData.id }</h3>
                </div>

                <div>
                    <p className='font-bold text-xl'>{ formatPrice(productData.preco) }</p>
                    <p>em até 6x de</p>
                    <p className='font-bold text-xl'>{ formatPrice(productData.preco / 6) }</p>
                    <p> sem juros</p>
                </div>
                <SmallButton  color='green' loadingButton={ isLoadingButton } disabled={ isDisabled() } onClick={ handleAddToCart }>
                    COMPRAR
                </SmallButton> 

            </section>

        </div>
    );
}