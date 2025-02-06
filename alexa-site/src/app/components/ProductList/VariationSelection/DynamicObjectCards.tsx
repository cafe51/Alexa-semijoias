'use client';
import useDynamicObjectCardsLogic from '@/app/hooks/useDynamicObjectCardsLogic';
import OptionButton from './OptionButton';
import { ProductBundleType, ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import Image from 'next/image';
import blankImage from '../../../../../public/blankImage.png';
import PriceSection from '../../PriceSection';
import QuantitySelectionCartBox from '../../QuantitySelectionCartBox';
import ProductSummary from './ProductSummary';
import { trackPixelEvent } from '@/app/utils/metaPixel';
import toTitleCase from '@/app/utils/toTitleCase';
import OutOfStockMessage from '../OutOfStockMessage';
import { MetaConversionsService } from '@/app/utils/meta-conversions/service';

interface DynamicObjectCardsProps {
  object: ProductBundleType & FireBaseDocument;
  carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
  closeModelClick: () => void;
  closeModalFinishBuyClick: () => void;
  setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null,
    productData: ProductVariation | null,
    setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>,
    quantity?: number
  ) => void;
  isLoadingButton: boolean;
  setCurrentProduct: (updatedProduct: ProductBundleType & FireBaseDocument) => void
}

const DynamicObjectCards: React.FC<DynamicObjectCardsProps> = ({
    object,
    handleAddToCart,
    carrinho,
    setIsloadingButton,
    closeModelClick,
    closeModalFinishBuyClick,
    isLoadingButton,
    setCurrentProduct,
}) => {


    const {
        currentPhase,
        setCurrentPhase,
        selectedOptions,
        setSelectedOptions,
        errorMessage,
        setErrorMessage,
        quantity,
        setQuantity,
        availableOptions,
        allOptions,
        productVariationsSelected,
        keys,
    } = useDynamicObjectCardsLogic(object, carrinho);


    // Se alguma variação não possuir customProperties (exemplo: produto sem variações) mantém o comportamento atual
    if (object.productVariations.some((pv) => pv.customProperties === undefined)) {
        return <p>Olá</p>;
    }

    const handleOptionSelect = (option: string) => {
        console.log('clicou', option);
        if (!availableOptions.includes(option)) {
            const errorMsg =
        currentPhase === 0 ? (
            <p>
            No momento estamos sem estoque de { keys[currentPhase] } { option }
            </p>
        ) : (
            <p className="text-xs text-center text-red-500 my-2">
                { toTitleCase(keys[currentPhase]) }{ ' ' }
                <span className="font-bold text-sm">{ option }</span> para{ ' ' }
                { keys[currentPhase - 1] }{ ' ' }
                <span className="font-bold text-sm">
                    { selectedOptions[keys[currentPhase - 1]].toLowerCase() }
                </span>{ ' ' }
            está indisponível no momento
            </p>
        );

            setErrorMessage(errorMsg);
            return;
        }

        setSelectedOptions({ ...selectedOptions, [keys[currentPhase]]: option });
        setErrorMessage(null);

        if (currentPhase < keys.length - 1) {
            setCurrentPhase(currentPhase + 1);
        } else {
            setCurrentPhase(keys.length); // Todas as fases completadas
        }
    };

    const handleBackButtonClick = () => {
        if (currentPhase > 0) {
            const previousPhase = currentPhase - 1;
            const previousKey = keys[previousPhase];
            const updatedOptions = { ...selectedOptions };
            delete updatedOptions[previousKey];
            setSelectedOptions(updatedOptions);
            setCurrentPhase(previousPhase);
        }
        setErrorMessage(null);
    };

    const isDisabled = () => {
        const cartItem = carrinho?.find(
            (item) => item.skuId === productVariationsSelected[0]?.sku,
        );
        if (!cartItem) {
            return productVariationsSelected.length !== 1;
        } else {
            return productVariationsSelected[0].estoque <= cartItem.quantidade;
        }
    };

    const availableStock = (totalStock: number) => {
        const cartItem = carrinho?.find(
            (item) => item.skuId === productVariationsSelected[0]?.sku,
        );
        if (!cartItem) {
            return totalStock;
        } else {
            return totalStock - cartItem.quantidade;
        }
    };

    // Essa função é chamada quando o usuário clica em “COMPRE JÁ” na etapa de quantidade.
    // Ela busca os dados atualizados do produto no Firestore e utiliza a variação atualizada.
    const handleFinalClick = async() => {
        setIsloadingButton(true);
        try {
            const res = await fetch(`/api/product/${object.id}`);
            if (!res.ok) {
                alert('Falha ao atualizar os dados do produto. Tente novamente.');
                setIsloadingButton(false);
                return;
            }
            const updatedProduct: ProductBundleType & FireBaseDocument =
        await res.json();
            setCurrentProduct(updatedProduct);


            if (updatedProduct.estoqueTotal <= 0) {
                alert('Este produto está sem estoque no momento.');
                setQuantity(1);
                setIsloadingButton(false);
                closeModelClick();
                return;
            }



            // Busca a variação atualizada com base no SKU selecionado
            const selectedSku = productVariationsSelected[0]?.sku;
            const updatedVariation = updatedProduct.productVariations.find(
                (pv: ProductVariation) => pv.sku === selectedSku,
            );

            if (!updatedVariation) {
                alert('A variação selecionada não está mais disponível.');
                setQuantity(1);
                setIsloadingButton(false);
                return;
            }

            // Verifica se a variação possui estoque disponível
            if (updatedVariation.estoque <= 0) {
                alert('A variação selecionada está esgotada.');
                // Define a opção selecionada para a última fase (a que acabou de ser completada) como desativada
                const lastPhaseKey = keys[keys.length - 1];
                // Remove a seleção da última fase e retorna para a fase anterior
                setSelectedOptions((prev) => {
                    const newOptions = { ...prev };
                    delete newOptions[lastPhaseKey];
                    return newOptions;
                });
                setCurrentPhase(keys.length - 1);
                setQuantity(1);
                setIsloadingButton(false);
                return;
            }

            // Adiciona ao carrinho usando os dados atualizados
            handleAddToCart(carrinho, updatedVariation, setIsloadingButton, quantity);

            trackPixelEvent('AddToCart', {
                content_type: 'product',
                content_ids: [object.id],
                content_name: object.name,
                content_category: object.sections[0],
                value: (object.value.promotionalPrice
                    ? object.value.promotionalPrice
                    : object.value.price) * quantity,
                currency: 'BRL',
                contents: [
                    {
                        id: object.id,
                        quantity: quantity,
                    },
                ],
            });

            // Envia evento para Meta Conversions API
            MetaConversionsService.getInstance()
                .sendAddToCart({
                    product: updatedProduct,
                    quantity,
                    url: window.location.href,
                })
                .catch((error) => {
                    console.error(
                        'Failed to send AddToCart event to Meta Conversions API:',
                        error,
                    );
                });

            closeModelClick();
            closeModalFinishBuyClick();
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            alert('Erro ao atualizar os dados do produto. Tente novamente.');
        } finally {
            setIsloadingButton(false);
        }
    };

    return (
        <div className="p-4">
            { errorMessage && <OutOfStockMessage message={ errorMessage } /> }
            { currentPhase < keys.length ? (
                <div className="flex flex-col gap-4 items-center justify-center">
                    <h2>{ keys[currentPhase] }</h2>
                    <div className="flex flex-wrap gap-2">
                        { allOptions.map((option, index) => (
                            <OptionButton
                                key={ index }
                                option={ option }
                                isAvailable={ availableOptions.includes(option) }
                                handleOptionSelect={ handleOptionSelect }
                            />
                        )) }
                    </div>
                    { currentPhase > 0 && (
                        <button
                            onClick={ () => {
                                setQuantity(1);
                                handleBackButtonClick();
                            } }
                            className="absolute top-4 left-4"
                        >
                            <MdOutlineArrowBackIos size={ 24 } />
                        </button>
                    ) }
                </div>
            ) : (
                <div className="flex flex-col gap-4 items-center justify-center">
                    <h2>Quantidade</h2>
                    <div className="flex gap-4 w-full h-[90px]">
                        <div className="rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0">
                            <Image
                                className="rounded-lg object-cover scale-100"
                                src={
                                    productVariationsSelected[0].image
                                        ? productVariationsSelected[0].image
                                        : blankImage
                                }
                                alt="Foto da peça"
                                fill
                                sizes="200px"
                            />
                        </div>
                        <ProductSummary selectedOptions={ selectedOptions } />
                    </div>

                    <QuantitySelectionCartBox
                        quantity={ quantity }
                        removeOne={ () =>
                            setQuantity((prevQuantity) => prevQuantity - 1)
                        }
                        addOne={ () => setQuantity((prevQuantity) => prevQuantity + 1) }
                        stock={ availableStock(productVariationsSelected[0].estoque) }
                        isLoadingButton={ isLoadingButton }
                    />

                    <PriceSection
                        product={ object }
                        isLoadingButton={ isLoadingButton }
                        isDisabled={ () => isDisabled() }
                        quantity={ quantity }
                        handleClick={ handleFinalClick }
                    />

                    <button
                        onClick={ () => {
                            setQuantity(1);
                            handleBackButtonClick();
                        } }
                        className="absolute top-4 left-4"
                    >
                        <MdOutlineArrowBackIos size={ 24 } />
                    </button>
                </div>
            ) }
        </div>
    );
};

export default DynamicObjectCards;
