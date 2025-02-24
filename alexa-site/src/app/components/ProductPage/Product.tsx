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
import { Badge } from '@/components/ui/badge';
import ImageCarousel from '@/app/components/ImageCarousel';
import { CardContent } from '@/components/ui/card';
import ShippingCalculator from '@/app/carrinho/ShippingCalculator';
import LoadingIndicator from '../LoadingIndicator';
import ProductJsonLd from './ProductJsonLd';
import ShareSection from './ShareSection';
import { createSlugName } from '@/app/utils/createSlugName';
import SelectionTooltip from '../SelectionTooltip';
import dynamic from 'next/dynamic';

const RecommendedProducts = dynamic(
    () => import('@/app/components/ProductPage/RecommendedProducts'),
    { ssr: true },
);

const TEXTO_DA_QUALIDADE_DA_SEMIJOIA = '\n\n\nNossas semijoias são de alto padrão pois são cuidadosamente folheadas a ouro 18K com um banho reforçado, garantindo um brilho intenso e resistência superior.';
const TEXTO_DA_QUALIDADE_DA_JOIA_EM_ACO = '\n\n\nO aço inox de alta qualidade garante uma durabilidade superior, evitando manchas, oxidação e desbotamento, mesmo com o uso diário. São peças feitas para brilhar tanto quanto você, sem perder seu charme ao longo do tempo. Para toda a vida. ';
const TEXTO_DA_GARANTIA = '\n\nCom 1 ano de garantia, você pode usar suas peças com confiança, sabendo que elas foram feitas para te acompanhar em todos os momentos especiais.\n';

export default function Product({ id, initialProduct }: { id: string; initialProduct: ProductBundleType & FireBaseDocument }) {
    const { carrinho, userInfo } = useUserInfo();
    const [shipping, setShipping] = useState<string | null>(null);
    // Estado local do produto – inicializado com os dados do SSR e atualizado via API
    const [product, setProduct] = useState<ProductBundleType & FireBaseDocument>(initialProduct);
    const [isLoadingButton, setIsloadingButton] = useState(false);
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalFinishBuy, setShowModalFinishBuy] = useState(false);
    const [localCartQuantity, setLocalCartQuantity] = useState<{ [key: string]: number }>({});
    const [showTooltip, setShowTooltip] = useState(false);

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

    // NOVA FUNÇÃO: Antes de finalizar a compra buscamos os dados atualizados do produto.
    // Se o estoque total ou o da variação estiverem zerados, alertamos o usuário e "resetamos" a seleção.
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

            // Recupera a variação atualizada com base no SKU selecionado
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
                // Reseta a seleção para que o usuário refaça a escolha
                setCurrentPhase(0);
                setSelectedOptions({});
                setQuantity(1);
                setIsloadingButton(false);
                return;
            }

            const price = updatedProduct.value.promotionalPrice || updatedProduct.value.price;
            const totalValue = price * quantity;

            // Envio de eventos de rastreamento
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

            // Adiciona ao carrinho utilizando a variação atualizada
            handleAddToCart(carrinho, updatedVariation, setIsloadingButton, quantity);

            // Atualiza a quantidade do carrinho localmente
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
        <main className="min-h-screen bg-[#FAF9F6] text-[#333333] px-0 md:px-8 mb-8 md:mt-16 animate-fadeIn">
            { product && <ProductJsonLd product={ product } selectedVariation={ productVariationsSelected[0] } /> }
            { showModalFinishBuy && <FinishBuyConfirmationModal closeModelClick={ () => setShowModalFinishBuy(false) } /> }
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8 flex-shrink-0 min-h-[600px]">
                    <section className="md:w-1/2 mx-0 px-0 flex items-center justify-center md:self-start">
                        <ImageCarousel productData={ product } />
                    </section>
                    <section className="md:w-1/2 px-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">{ product.name.toUpperCase() }</h1>
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                { product.categories.map((category, index) => (
                                    <Badge key={ index } variant="secondary" className="bg-[#F8C3D3] text-[#333333]">
                                        { category }
                                    </Badge>
                                )) }
                                { product.lancamento && <Badge variant="destructive" className="bg-[#C48B9F] text-white">Lançamento</Badge> }
                            </div>
                            <p className="text-gray-600 md:text-base mb-6 whitespace-pre-line ">{
                                product.description +
                                (product.sections.includes('joias em aço inox') ?  TEXTO_DA_QUALIDADE_DA_JOIA_EM_ACO : TEXTO_DA_QUALIDADE_DA_SEMIJOIA)
                            + (!product.sections.includes('joias em aço inox') ? TEXTO_DA_GARANTIA : '')
                            }</p>
                        </div>
                        { !product.productVariations.some((pv) => pv.customProperties === undefined) && (
                            <CardContent className="p-0">
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
                        <PriceSection
                            product={ product }
                            isLoadingButton={ isLoadingButton }
                            isDisabled={ isDisabled }
                            quantity={ quantity }
                            handleClick={ handleFinishBuyClick }
                            setShowTooltip={ setShowTooltip }
                        />
                        <div className="py-4 gap-4 border-solid border-2 border-x-0 bg-white rounded-lg *:text-lg *:uppercase borderColor text-center w-full flex justify-center mt-2">
                            <ShippingCalculator
                                onSelectShipping={ selectShipping }
                                selectedShipping={ shipping ? Number(shipping) : null }
                                couponDiscount={ 0 }
                                cartPrice={ (product.value.promotionalPrice || product.value.price) * quantity }
                                showFreeShippingSection={ false }
                            />
                        </div>
                        <ShareSection url={ `www.alexasemijoias.com.br/product/${createSlugName(product.name)}` } />
                    </section>
                </div>
            </div>
            <RecommendedProducts mainProductId={ id } />
        </main>
    );
}
