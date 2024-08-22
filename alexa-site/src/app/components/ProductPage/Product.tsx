//app/components/Product.tsx
'use client';
import { useEffect, useState } from 'react';
import { FireBaseDocument, ProductBundleType } from '../../utils/types';
import ResponsiveCarousel from '../ResponsiveCarousel';
// import Link from 'next/link';
// import { useUserInfo } from '../hooks/useUserInfo';
import { useCollection } from '../../hooks/useCollection';
import PriceSection from '../PriceSection';
import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import PropertiesSelectionSection from './PropertiesSelectionSection';
import useDynamicObjectCardsLogic from '@/app/hooks/useDynamicObjectCardsLogic';

export default function Product({ id }: { id: string }) {
    const { carrinho } = useUserInfo();
    const { getDocumentById } = useCollection<ProductBundleType>('products');
    const [product, setProduct] = useState<ProductBundleType & FireBaseDocument | null>(null);
    const [isLoadingButton, setIsloadingButton] = useState(true);
    const { handleAddToCart } = useAddNewItemCart();
    const [isLoading, setIsLoading] = useState(true);
    const {
        currentPhase, setCurrentPhase,
        selectedOptions, setSelectedOptions,
        errorMessage, setErrorMessage,
        quantity, setQuantity,
        availableOptions,
        allOptions,
        productVariationsSelected,
        keys,
    } = useDynamicObjectCardsLogic(product!, carrinho);

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

    if(isLoading || !product) {
        return <h1>Carregando...</h1>;
    }


    const isDisabled = () => {
        const cartItem = carrinho?.find(item => item.skuId === productVariationsSelected[0]?.sku);
        if(!cartItem) {
            return (productVariationsSelected.length !== 1);
        } else {
            return (
                (cartItem && productVariationsSelected[0].estoque <= cartItem.quantidade)
            );
        }
    };


    return (
        <main className='flex flex-col gap-4'>
            { /* <p>
                        <Link href={ '/' }>Início/</Link> <Link href={ `/${productType}` }>{ productType.charAt(0).toUpperCase() + productType.slice(1) }/ </Link> <span className='font-bold'>{ product.name }</span>
                    </p> */ }
                        
            <ResponsiveCarousel productData={ product }/>

            <section>
                <h2 className='font-normal'>{ product.name.toUpperCase() }</h2>
                <p className='text-sm'>{ product.description }</p>
            </section>

            <PropertiesSelectionSection
                object={ product }
                carrinho={ carrinho }
                handleAddToCart={ handleAddToCart }
                setIsloadingButton={ setIsloadingButton }
                selectedOptions={ selectedOptions }
                closeModelClick={ () => () => null }
                closeModalFinishBuyClick={ () => () => null }
                currentPhase={ currentPhase }
                setCurrentPhase={ setCurrentPhase }
                setSelectedOptions={ setSelectedOptions }
                errorMessage={ errorMessage }
                setErrorMessage={ setErrorMessage }
                quantity={ quantity }
                setQuantity={ setQuantity }
                availableOptions={ availableOptions }
                allOptions={ allOptions }
                productVariationsSelected={ productVariationsSelected }
                keys={ keys }
            />

            <PriceSection
                product={ product }
                isLoadingButton={ isLoadingButton }
                isDisabled={ isDisabled }
                quantity={ quantity }
                handleClick={ () => {
                    productVariationsSelected.length === 1 && handleAddToCart(carrinho, productVariationsSelected[0], setIsloadingButton, quantity);
                } }
            />

            <div className='py-4 gap-4 border-solid border-2 border-x-0 borderColor'>
                <p> Frete e prazo </p>
                <div className='flex py-4 gap-4 '>
                    <input className='px-2 w-full' placeholder='Insira seu CEP'></input>
                    <button className='bg-black text-white p-4 rounded-full'>Calcular</button>
                </div>
            </div>
        </main>
    );
}
