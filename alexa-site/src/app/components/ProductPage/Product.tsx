// src/app/components/ProductPage/Product.tsx
'use client';
import { useEffect, useState, useCallback } from 'react';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import { trackPixelEvent } from '@/app/utils/metaPixel';
import { sendGAEvent, sendGTMEvent } from '@/app/utils/analytics';
import { MetaConversionsService } from '@/app/utils/meta-conversions/service';
import PriceSection from '@/app/components/PriceSection';
import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import PropertiesSelectionSection from './PropertiesSelectionSection';
import useDynamicObjectCardsLogic from '@/app/hooks/useDynamicObjectCardsLogic';
import FinishBuyConfirmationModal from '@/app/components/FinishBuyConfirmationModal';
import ImageCarousel from '@/app/components/ImageCarousel';
import { CardContent } from '@/components/ui/card';
import ShippingCalculator from '@/app/carrinho/ShippingCalculator';
import LoadingIndicator from '../LoadingIndicator';
import ProductJsonLd from './ProductJsonLd';
import ShareSection from './ShareSection';
import { createSlugName } from '@/app/utils/createSlugName';
import SelectionTooltip from '../SelectionTooltip';
import StockWarning from './StockWarning';
import ProductDescription from './ProductDescription';
import ProductCategories from './ProductCategories';
import DiscoverOurProductsImagesCarousel from '../homePage/DiscoverOurProducts/DiscoverOurProductsImagesCarousel';
import FAQSection from '../FAQSection';
import SectionsMobileCarousel from '../homePage/Sections/SectionsMobileCarousel';
import { faqProductPage } from './faqProductPage';


interface ProductProps {
    id: string;
    initialProduct: ProductBundleType & FireBaseDocument;
    recommendedProducts: ((ProductBundleType & FireBaseDocument)[] | []);
    sectionProducts: ((ProductBundleType & FireBaseDocument)[] | []);
    initialSelectedOptions?: { [key: string]: string };
}

export default function Product({ id, initialProduct, recommendedProducts, sectionProducts, initialSelectedOptions = {} }: ProductProps) {
    const { carrinho, userInfo } = useUserInfo();
    const [shipping, setShipping] = useState<string | null>(null);
    // Estado local do produto – inicializado com os dados do SSR e atualizado via API
    const [product, setProduct] = useState<ProductBundleType & FireBaseDocument>(initialProduct);
    const [isLoadingButton, setIsloadingButton] = useState(false);
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalFinishBuy, setShowModalFinishBuy] = useState(false);
    const [localCartQuantity, setLocalCartQuantity] = useState<{ [key: string]: number }>({});
    const [showTooltip, setShowTooltip] = useState(false);

    // Agora, passa a configuração inicial de seleção para o hook
    const {
        currentPhase, setCurrentPhase,
        selectedOptions, setSelectedOptions,
        availableOptions,
        allOptions,
        errorMessage, setErrorMessage,
        productVariationsSelected,
        keys,
        quantity, setQuantity,
    } = useDynamicObjectCardsLogic(product, carrinho, initialSelectedOptions);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

    useEffect(() => {
        // Dispara eventos de visualização do produto
        const productPrice = initialProduct.productVariations[0].value.price;

        // Meta Pixel
        trackPixelEvent('ViewContent', {
            content_type: 'product',
            content_ids: [initialProduct.id],
            content_name: initialProduct.name,
            content_category: initialProduct.sections[0],
            value: productPrice,
            currency: 'BRL',
        });

        // Meta Conversions API
        MetaConversionsService.getInstance().sendViewContent({
            product: initialProduct,
            url: window.location.href,
            ...(userInfo && { userData: userInfo }),
        }).catch(error => {
            console.error('Failed to send ViewContent event to Meta Conversions API:', error);
        });

        // Google Analytics
        sendGAEvent('view_item', {
            currency: 'BRL',
            value: productPrice,
            items: [{
                item_id: initialProduct.id,
                item_name: initialProduct.name,
                item_category: initialProduct.sections[0],
                price: productPrice,
            }],
        });

        // Google Tag Manager
        sendGTMEvent('view_item', {
            ecommerce: {
                currency: 'BRL',
                value: productPrice,
                items: [{
                    item_id: initialProduct.id,
                    item_name: initialProduct.name,
                    item_category: initialProduct.sections[0],
                    price: productPrice,
                }],
            },
        });

        setIsloadingButton(false);

        // Atualiza os dados do produto via API (lado do servidor)
        const updateProductState = async() => {
            try {
                const res = await fetch(`/api/product/${id}`);
                if (!res.ok) {
                    console.error('Falha ao atualizar os dados do produto');
                    return;
                }
                const updatedProduct = await res.json();
                console.log('Produto atualizado:', updatedProduct);
                if (updatedProduct && updatedProduct.exist) {
                    setProduct(updatedProduct);
                }
            } catch (error) {
                console.error('Erro ao atualizar o produto:', error);
            }
        };

        updateProductState();
    }, [id, initialProduct, userInfo]);

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

    const handleFinishBuyClick = useCallback(async() => {
        setIsloadingButton(true);
        try {
            const res = await fetch(`/api/product/${id}`);
            if (!res.ok) {
                alert('Falha ao atualizar os dados do produto. Tente novamente.');
                setIsloadingButton(false);
                return;
            }
            const updatedProduct: ProductBundleType & FireBaseDocument = await res.json();
            setProduct(updatedProduct);

            if (updatedProduct.estoqueTotal <= 0) {
                alert('Este produto está sem estoque no momento.');
                setIsloadingButton(false);
                return;
            }

            const selectedSku = productVariationsSelected[0]?.sku;
            const updatedVariation = updatedProduct.productVariations.find(
                (pv) => pv.sku === selectedSku,
            );

            if (!updatedVariation) {
                alert('A variação selecionada não está mais disponível.');
                setIsloadingButton(false);
                return;
            }

            if (updatedVariation.estoque <= 0) {
                alert('A variação selecionada está esgotada.');
                setCurrentPhase(0);
                setSelectedOptions({});
                setQuantity(1);
                setIsloadingButton(false);
                return;
            }

            const price = updatedProduct.value.promotionalPrice || updatedProduct.value.price;
            const totalValue = price * quantity;

            trackPixelEvent('AddToCart', {
                content_type: 'product',
                content_ids: [updatedProduct.id],
                content_name: updatedProduct.name,
                content_category: updatedProduct.sections[0],
                value: totalValue,
                currency: 'BRL',
                contents: [{
                    id: updatedProduct.id,
                    quantity: quantity,
                }],
            });

            MetaConversionsService.getInstance().sendAddToCart({
                product: updatedProduct,
                quantity,
                url: window.location.href,
            }).catch((error) => {
                console.error('Failed to send AddToCart event to Meta Conversions API:', error);
            });

            sendGAEvent('add_to_cart', {
                currency: 'BRL',
                value: totalValue,
                items: [{
                    item_id: updatedVariation.sku,
                    item_name: updatedProduct.name,
                    item_category: updatedProduct.sections[0],
                    price: price,
                    quantity: quantity,
                }],
            });

            sendGTMEvent('add_to_cart', {
                ecommerce: {
                    currency: 'BRL',
                    value: totalValue,
                    items: [{
                        item_id: updatedVariation.sku,
                        item_name: updatedProduct.name,
                        item_category: updatedProduct.sections[0],
                        price: price,
                        quantity: quantity,
                    }],
                },
            });

            handleAddToCart(carrinho, updatedVariation, setIsloadingButton, quantity);

            setLocalCartQuantity(prev => ({
                ...prev,
                [updatedVariation.sku]: (prev[updatedVariation.sku] || 0) + quantity,
            }));

            const newCartQuantity = (localCartQuantity[updatedVariation.sku] || 0) + quantity;
            const remainingQuantity = updatedVariation.estoque - newCartQuantity;

            if (remainingQuantity > 0) {
                setQuantity(1);
            } else {
                setCurrentPhase(0);
                setSelectedOptions({});
            }
            setShowModalFinishBuy(prev => !prev);
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            alert('Erro ao atualizar os dados do produto. Tente novamente.');
        } finally {
            setIsloadingButton(false);
        }
    }, [
        id,
        carrinho,
        productVariationsSelected,
        quantity,
        localCartQuantity,
        setIsloadingButton,
        setProduct,
        setCurrentPhase,
        setSelectedOptions,
        setQuantity,
        handleAddToCart,
        setShowModalFinishBuy,
    ]);

    if (!product) return <LoadingIndicator />;

    return (
        <main className="min-h-screen bg-white text-[#333333] px-0 mb-8 animate-fadeIn">
            { product && <ProductJsonLd product={ product } /> }
            { showModalFinishBuy && <FinishBuyConfirmationModal closeModelClick={ () => setShowModalFinishBuy(false) } /> }
            <div className="w-full mx-auto ">
                <div className="flex flex-col md:grid md:grid-cols-[60%_auto] min-h-[600px]">
                    <section className="mx-0 px-0 aspect-auto">
                        <ImageCarousel productData={ product } options={ { loop: true } }/>
                    </section>

                    <section className="px-4 ">

                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{ product.name.toUpperCase() }</h1>
                        <div className='lg:w-11/12 xl:w-8/12  '>

                            { !product.productVariations.some((pv) => pv.customProperties === undefined) && (
                                <CardContent className="p-0 ">
                                    <SelectionTooltip
                                        isVisible={ showTooltip }
                                        onClose={ () => setShowTooltip(false) }
                                    />
                                    <PropertiesSelectionSection 
                                        isLoadingButton={ isLoadingButton }
                                        carrinho={ carrinho }
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
                            ) }
                            { product.productVariations.length === 1 && product.estoqueTotal <= 5 && <StockWarning stock={ product.estoqueTotal } /> }
                            <div className=''>
                                <PriceSection
                                    product={ product }
                                    isLoadingButton={ isLoadingButton }
                                    isDisabled={ isDisabled }
                                    quantity={ quantity }
                                    handleClick={ handleFinishBuyClick }
                                    setShowTooltip={ setShowTooltip }
                                />

                                <ShippingCalculator
                                    onSelectShipping={ selectShipping }
                                    selectedShipping={ shipping ? Number(shipping) : null }
                                    couponDiscount={ 0 }
                                    cartPrice={ (product.value.promotionalPrice || product.value.price) * quantity }
                                    showFreeShippingSection={ false }
                                />

                                <ShareSection url={ `www.alexasemijoias.com.br/product/${createSlugName(product.name)}` } />
                            </div>
                        </div>
                        <ProductCategories product={ product } />

                        <ProductDescription product={ product } />

                    </section>
                </div>
            </div>
            <div className='w-full text-center'>
                <h1 className='text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center text-[#333333] my-8 md:my-12'>Você Também Vai Amar</h1>
                <DiscoverOurProductsImagesCarousel products={ recommendedProducts } />
            </div>
            <FAQSection faqs={ faqProductPage }/>
            <SectionsMobileCarousel products={ sectionProducts } />
        </main>
    );
}
