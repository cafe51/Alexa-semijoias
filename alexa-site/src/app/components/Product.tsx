//app/components/Product.tsx
'use client';
import { useEffect, useState } from 'react';
import { ProductType } from '../utils/types';
import ResponsiveCarousel from './ResponsiveCarousel';
import Link from 'next/link';
import { useUserInfo } from '../hooks/useUserInfo';
import formatPrice from '../utils/formatPrice';
import { useAddNewItemCart } from '../hooks/useAddNewItemCart';
import { useCollection } from '../hooks/useCollection';
import LargeButton from './LargeButton';

export default function Product({ id, productType }: {id: string, productType: string}) {
    const { carrinho } = useUserInfo();
    const { getDocumentById } = useCollection<ProductType>('produtos');
    const [product, setProduct] = useState<ProductType | null>(null);
    const [isLoadingButton, setIsloadingButton] = useState(true);
    const { handleAddToCart } = useAddNewItemCart(carrinho, product, setIsloadingButton);
    const [isLoading, setIsLoading] = useState(true);

    const isDisabled = () => {
        const cartItem = carrinho?.find((item) => item.productId === product?.id);
        return cartItem ? cartItem.quantidade >= cartItem.estoque : false;
    };
    const updateProductsState = async() => {
        const productData = await getDocumentById(id);
        if (productData.exist) {
            setProduct(productData);
            setIsLoading(false);

        } else {
            console.log('Produto Não encontrado', productData);
        }
    };

    useEffect(() => {
        updateProductsState();
    }, []);

    useEffect(() => {
        setIsLoading(true);
        try {
            product && setIsLoading(false);
            setIsloadingButton(false);

        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);  
            } else { console.log('erro desconhecido'); }
        }
    
    }, [product]);

    return (
        <main>
            { isLoading || !product ? 'carregando' : (
                <>  
                    <p>
                        <Link href={ '/' }>Início/</Link> <Link href={ `/${productType}` }>{ productType.charAt(0).toUpperCase() + productType.slice(1) }/ </Link> <span className='font-bold'>{ product.nome }</span>
                    </p>
                        
                    <ResponsiveCarousel productData={ product }/>
                        
                    <p className='text-sm'>{ product.descricao }</p>
                    <h2 className='font-normal'>{ product.nome.toUpperCase() }</h2>

                    <div className='w-full p-2 border-solid border-2 border-x-0 borderColor'>
                        <h1 className='font-bold '>{ formatPrice(product.preco) } </h1>
                        <p> em até 6x de { formatPrice(product.preco/6) } sem juros </p>

                        <p> Formas de pagamento </p>
                    </div>
                    <LargeButton color='green' loadingButton={ isLoadingButton } onClick={ handleAddToCart } disabled={ isDisabled() }>
                        COMPRE JÁ
                    </LargeButton>
                    <div className='py-4 gap-4 border-solid border-2 border-x-0 borderColor'>
                        <p> Frete e prazo </p>
                        <div className='flex py-4 gap-4 '>
                            <input className='px-2 w-full' placeholder='Insira seu CEP'></input>
                            <button className='bg-black text-white p-4 rounded-full'>Calcular</button>
                        </div>
                    </div>
                            
                </>

            ) }
        </main>
    );
}
