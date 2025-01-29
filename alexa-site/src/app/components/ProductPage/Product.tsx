// src/app/components/ProductPage/Product.tsx

'use client';
import { useEffect, useState, useCallback } from 'react';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { useCollection } from '@/app/hooks/useCollection';
import { trackPixelEvent } from '@/app/utils/metaPixel';
import PriceSection from '@/app/components/PriceSection';
import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import PropertiesSelectionSection from './PropertiesSelectionSection';
import useDynamicObjectCardsLogic from '@/app/hooks/useDynamicObjectCardsLogic';
import FinishBuyConfirmationModal from '@/app/components/FinishBuyConfirmationModal';
import { Badge } from '@/components/ui/badge';
import ImageCarousel from '@/app/components/ImageCarousel';
import { Card, CardContent } from '@/components/ui/card';
import ShippingCalculator from '@/app/carrinho/ShippingCalculator';
import LoadingIndicator from '../LoadingIndicator';
import ProductJsonLd from './ProductJsonLd';
import RecommendedProducts from './RecommendedProducts';

export default function Product({ id, initialProduct }: { id: string; initialProduct: ProductBundleType & FireBaseDocument }) {
    const { carrinho } = useUserInfo();
    const [shipping, setShipping] = useState<string | null>(null);
    const { getDocumentById } = useCollection<ProductBundleType>('products');
    const [product, setProduct] = useState<ProductBundleType & FireBaseDocument>(initialProduct);
    const [isLoadingButton, setIsloadingButton] = useState(true);
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalFinishBuy, setShowModalFinishBuy] = useState(false);
    const [localCartQuantity, setLocalCartQuantity] = useState<{ [key: string]: number }>({});

    const {
        currentPhase, setCurrentPhase,
        selectedOptions, setSelectedOptions,
        errorMessage, setErrorMessage,
        quantity, setQuantity,
        availableOptions,
        allOptions,
        productVariationsSelected,
        keys,
    } = useDynamicObjectCardsLogic(product, carrinho);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        // Dispara o evento ViewContent do Meta Pixel
        trackPixelEvent('ViewContent', {
            content_type: 'product',
            content_ids: [initialProduct.id],
            content_name: initialProduct.name,
            content_category: initialProduct.sections[0],
            value: initialProduct.productVariations[0].value.price,
            currency: 'BRL',
        });
        setIsloadingButton(false);

        const updateProductsState = async() => {
            const productData = await getDocumentById(id);
            if (productData.exist) {
                setProduct(productData);
            }
        };

        // Atualiza os dados em segundo plano
        updateProductsState();
    }, [getDocumentById, id, initialProduct]);

    useEffect(() => {
        // Inicializa o localCartQuantity com as quantidades do carrinho
        const initialQuantities: { [key: string]: number } = {};
        carrinho?.forEach(item => {
            initialQuantities[item.skuId] = item.quantidade;
        });
        setLocalCartQuantity(initialQuantities);
    }, [carrinho]);

    const selectShipping = (optionId: string) => {
        setShipping(optionId);
    };

    const isDisabled = useCallback(() => {
        if (productVariationsSelected.length !== 1) return true;
        const selectedVariation = productVariationsSelected[0];
        const cartQuantity = localCartQuantity[selectedVariation.sku] || 0;
        return selectedVariation.estoque <= cartQuantity;
    }, [productVariationsSelected, localCartQuantity]);

    const handleFinishBuyClick = useCallback(() => {
        if (productVariationsSelected.length === 1) {
            const selectedVariation = productVariationsSelected[0];
            handleAddToCart(carrinho, selectedVariation, setIsloadingButton, quantity);
            
            // Atualiza o localCartQuantity imediatamente
            setLocalCartQuantity(prev => ({
                ...prev,
                [selectedVariation.sku]: (prev[selectedVariation.sku] || 0) + quantity,
            }));

            const newCartQuantity = (localCartQuantity[selectedVariation.sku] || 0) + quantity;
            const remainingQuantity = selectedVariation.estoque - newCartQuantity;

            console.log('Remaining quantity:', remainingQuantity);

            if (remainingQuantity > 0) {
                setQuantity(1);
            } else {
                console.log('Acabou');
                setCurrentPhase(0);
                setSelectedOptions({});
            }
        }
        setShowModalFinishBuy(prev => !prev);
    }, [handleAddToCart, carrinho, productVariationsSelected, quantity, setIsloadingButton, localCartQuantity, setQuantity, setCurrentPhase, setSelectedOptions]);

    if(!product) return <LoadingIndicator />;

    return (
        <main className="min-h-screen bg-[#FAF9F6] text-[#333333] px-0 md:px-8 mb-8 md:mt-16 animate-fadeIn">
            { product && <ProductJsonLd product={ product } selectedVariation={ productVariationsSelected[0] } /> }
            { showModalFinishBuy && <FinishBuyConfirmationModal closeModelClick={ () => setShowModalFinishBuy(false) } /> }
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 flex-shrink-0 min-h-[600px]">
                    <section className="md:w-1/2 mx-0 px-0 flex items-center justify-center">
                        <ImageCarousel productData={ product }/>
                    </section>

                    <section className="md:w-1/2 px-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">{ product.name.toUpperCase() }</h1>

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                { product.categories.map((category, index) => (
                                    <Badge key={ index } variant="secondary" className="bg-[#F8C3D3] text-[#333333]">{ category }</Badge>
                                )) }
                                { product.lancamento && <Badge variant="destructive" className="bg-[#C48B9F] text-white">Lançamento</Badge> }
                            </div>

                            <p className="text-gray-600 text-sm md:text-base mb-6">{ product.description }</p>
                        </div>
                        {
                            !product.productVariations.some((pv) => pv.customProperties === undefined) && (
                                <Card className='border-[#F8C3D3]'>
                                    <CardContent className="p-4">
                                        <PropertiesSelectionSection
                                            isLoadingButton={ isLoadingButton }
                                            carrinho={ carrinho }
                                            handleAddToCart={ handleAddToCart }
                                            selectedOptions={ selectedOptions }
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
                                    </CardContent>
                                </Card>
                            )
                        }
                        
                        <PriceSection
                            product={ product }
                            isLoadingButton={ isLoadingButton }
                            isDisabled={ isDisabled }
                            quantity={ quantity }
                            handleClick={ handleFinishBuyClick }
                        />

                        <div className='py-4 gap-4 border-solid border-2 border-x-0 bg-white rounded-lg *:text-lg *:uppercase borderColor text-center w-full flex justify-center mt-2'>
                            <ShippingCalculator onSelectShipping={ selectShipping } selectedShipping={ Number(shipping) }/>
                        </div>
                    </section>
                </div>
            </div>
            <RecommendedProducts mainProductId={ id } />
        </main>
    );
}
