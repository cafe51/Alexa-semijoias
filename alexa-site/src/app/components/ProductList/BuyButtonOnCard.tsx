// src/app/components/ProductList/BuyButtonOnCard.tsx
'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ModalMaker from '../ModalMakers/ModalMaker';
import DynamicObjectCards from './VariationSelection/DynamicObjectCards';
import { useAddNewItemCart } from '@/app/hooks/useAddNewItemCart';
import { useUserInfo } from '@/app/hooks/useUserInfo';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import FinishBuyConfirmationModal from '../FinishBuyConfirmationModal';
import { ImSpinner9 } from 'react-icons/im';
import { trackPixelEvent } from '@/app/utils/metaPixel';
import { MetaConversionsService } from '@/app/utils/meta-conversions/service';

export function BuyButtonOnCard({
    product,
}: {
  product: ProductBundleType & FireBaseDocument;
}) {
    // Estado local para manter os dados atualizados do produto
    const [currentProduct, setCurrentProduct] = useState(product);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const { carrinho } = useUserInfo();
    const { handleAddToCart } = useAddNewItemCart();
    const [showModalOptionsVariation, setShowModalOptionsVariation] = useState(false);
    const [showModalFinishBuy, setShowModalFinishBuy] = useState(false);

    // Função que verifica se o botão deve estar desabilitado, usando os dados atualizados
    const isDisabled = () => {
        if (currentProduct) {
            if (currentProduct.estoqueTotal <= 0) return true;

            const cartItems = carrinho?.filter(
                (item) => item.productId === currentProduct.id,
            );

            if (cartItems) {
                if (cartItems.length > 1) {
                    let totalQuantityCart = 0;
                    for (const cartItem of cartItems) totalQuantityCart += cartItem.quantidade;
                    return currentProduct.estoqueTotal <= totalQuantityCart;
                }
                if (cartItems.length === 1) {
                    return currentProduct.estoqueTotal <= cartItems[0].quantidade;
                }
            }
            return false;
        }
        return true;
    };

    // Ao clicar, buscamos os dados atualizados do produto
    const handleClickButtonBuyNow = async() => {
        setIsLoadingButton(true);
        try {
            // Solicita dados atualizados do produto via API
            const res = await fetch(`/api/product/${product.id}`);
            if (!res.ok) {
                alert('Falha ao atualizar os dados do produto. Tente novamente.');
                setIsLoadingButton(false);
                return;
            }
            const updatedProduct: ProductBundleType & FireBaseDocument = await res.json();

            // Atualiza o estado local com os dados atualizados
            setCurrentProduct(updatedProduct);

            // Se o estoque atualizado for 0, impede a compra e alerta o usuário
            if (updatedProduct.estoqueTotal <= 0) {
                alert('Este produto está esgotado.');
                setIsLoadingButton(false);
                return;
            }

            // Se houver mais de uma variação, abre o modal de seleção
            if (updatedProduct.productVariations.length > 1) {
                setShowModalOptionsVariation(true);
            } else {
                // Adiciona ao carrinho usando os dados atualizados
                handleAddToCart(carrinho, updatedProduct.productVariations[0], setIsLoadingButton);

                // Envia eventos de rastreamento (Meta Pixel, etc)
                trackPixelEvent('AddToCart', {
                    content_type: 'product',
                    content_ids: [updatedProduct.id],
                    content_name: updatedProduct.name,
                    content_category: updatedProduct.sections[0],
                    value: (updatedProduct.value.promotionalPrice
                        ? updatedProduct.value.promotionalPrice
                        : updatedProduct.value.price) * 1,
                    currency: 'BRL',
                    contents: [
                        {
                            id: updatedProduct.id,
                            quantity: 1,
                        },
                    ],
                });

                MetaConversionsService.getInstance()
                    .sendAddToCart({
                        product: updatedProduct,
                        quantity: 1,
                        url: window.location.href,
                    })
                    .catch((error) => {
                        console.error('Failed to send AddToCart event to Meta Conversions API:', error);
                    });

                setShowModalFinishBuy(true);
            }
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            alert('Erro ao atualizar os dados do produto. Tente novamente.');
        } finally {
            setIsLoadingButton(false);
        }
    };

    return (
        <>
            { showModalFinishBuy && (
                <FinishBuyConfirmationModal
                    closeModelClick={ () => setShowModalFinishBuy(!showModalFinishBuy) }
                />
            ) }

            { showModalOptionsVariation && (
                <ModalMaker
                    closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) }
                    title="Escolha a variação"
                >
                    <section>
                        <DynamicObjectCards
                            // Passa o produto atualizado para o modal
                            object={ currentProduct }
                            carrinho={ carrinho }
                            handleAddToCart={ handleAddToCart }
                            setIsloadingButton={ setIsLoadingButton }
                            closeModelClick={ () => setShowModalOptionsVariation(!showModalOptionsVariation) }
                            closeModalFinishBuyClick={ () => setShowModalFinishBuy(!showModalFinishBuy) }
                            isLoadingButton={ isLoadingButton }
                            setCurrentProduct={ (updatedProduct: ProductBundleType & FireBaseDocument) => setCurrentProduct(updatedProduct) }
                        />
                    </section>
                </ModalMaker>
            ) }

            <Button
                className="w-full bg-[#D4AF37] hover:bg-[#C48B9F] text-white py-2 sm:py-3 md:py-4 text-lg lg:text-xl"
                onClick={ handleClickButtonBuyNow }
                disabled={ isDisabled() }
            >
                { isLoadingButton ? (
                    <ImSpinner9 className="text-gray-500 animate-spin" />
                ) : (
                    'COMPRAR'
                ) }
            </Button>
        </>
    );
}
