import React, { useEffect } from 'react';
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
    (carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null,
    productData: ProductVariation | null,
    setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>,
    quantity?: number) => void
    );
    isLoadingButton: boolean;
}

const DynamicObjectCards: React.FC<DynamicObjectCardsProps> = ({
    object,
    handleAddToCart,
    carrinho,
    setIsloadingButton,
    closeModelClick,
    closeModalFinishBuyClick,
    isLoadingButton }) => {
    const {
        currentPhase, setCurrentPhase,
        selectedOptions, setSelectedOptions,
        errorMessage, setErrorMessage,
        quantity, setQuantity,
        availableOptions,
        allOptions,
        productVariationsSelected,
        keys,
    } = useDynamicObjectCardsLogic(object, carrinho);


    useEffect(() => {
        console.log('KEEEEYS', keys);
        console.log('CURRENTPHASE', currentPhase);
        console.log('SELECTEDOPTIONS', selectedOptions);
    }, [keys, currentPhase]);
    

    if (object.productVariations.some((pv) => pv.customProperties === undefined)) {
        return <p>Olá</p>;
    }
  

    const handleOptionSelect = (option: string) => {
        console.log('clicou', option);
        if (!availableOptions.includes(option)) {
            const errorMessage = currentPhase === 0
                ? <p>No momento estamos sem estoque de { keys[currentPhase] } { option }</p>
                : 
                <p className="text-xs text-center text-red-500 my-2" >
                    { toTitleCase(keys[currentPhase]) } <span className='font-bold text-sm'>{ option }</span> para { keys[currentPhase - 1] } <span className='font-bold text-sm'>{ selectedOptions[keys[currentPhase - 1]].toLowerCase() }</span> está indisponível no momento
                </p>
                ;

            setErrorMessage(errorMessage);
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
        const cartItem = carrinho?.find(item => item.skuId === productVariationsSelected[0]?.sku);
        if(!cartItem) {
            return (productVariationsSelected.length !== 1);
        } else {
            return (
                (cartItem && productVariationsSelected[0].estoque <= cartItem.quantidade)
            );
        }
    };

    const availableStock = (totalStock: number) => {
        const cartItem = carrinho?.find(item => item.skuId === productVariationsSelected[0]?.sku);
        if(!cartItem) {
            return totalStock;
        } else {
            return totalStock - cartItem.quantidade;
        }
    };


    return (
        <div className="p-4">
            { errorMessage && <OutOfStockMessage message={ errorMessage } /> }
            { currentPhase < keys.length ? (
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <h2>{ keys[currentPhase] }</h2>
                    <div className="flex flex-wrap gap-2">
                        { allOptions.map((option, index) => (
                            <OptionButton key={ index } option={ option } isAvailable={ availableOptions.includes(option) } handleOptionSelect={ handleOptionSelect } />
                        )) }
                    </div>
                    { currentPhase > 0 && (
                        <button onClick={ () => {
                            setQuantity(1);
                            handleBackButtonClick();
                        } } className="absolute top-4 left-4">
                            <MdOutlineArrowBackIos size={ 24 }/>
                        </button>
                    ) }
                </div>
            ) : (
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <h2>Quantidade</h2>
                    <div className='flex gap-4 w-full h-[90px] '>
                        <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                            <Image
                                className='rounded-lg object-cover scale-100'
                                src={ productVariationsSelected[0].image ? productVariationsSelected[0].image : blankImage }
                                alt="Foto da peça"
                                fill
                                sizes='200px'
                            />
                        </div>
                        <ProductSummary selectedOptions={ selectedOptions } />
                    </div>  

                    <QuantitySelectionCartBox
                        quantity={ quantity }
                        removeOne={ () =>  setQuantity((prevQuantity) => prevQuantity -= 1) }
                        addOne={ () => setQuantity((prevQuantity) => prevQuantity += 1) }
                        stock={ availableStock(productVariationsSelected[0].estoque) }
                        isLoadingButton={ isLoadingButton }
                    />

                    <PriceSection
                        product={ object }
                        isLoadingButton={ isLoadingButton }
                        isDisabled={ () => isDisabled() }
                        quantity={ quantity }
                        handleClick={
                            () => {
                                productVariationsSelected.length === 1 && handleAddToCart(carrinho, productVariationsSelected[0], setIsloadingButton, quantity);
                                productVariationsSelected.length === 1 && trackPixelEvent('AddToCart', {
                                    content_type: 'product',
                                    content_ids: [object.id],
                                    content_name: object.name,
                                    content_category: object.sections[0],
                                    value: (object.value.promotionalPrice ? object.value.promotionalPrice : object.value.price) * quantity,
                                    currency: 'BRL',
                                    contents: [{
                                        id: object.id,
                                        quantity: quantity,
                                    }],
                                });
                                
                                // Meta Conversions API
                                MetaConversionsService.getInstance().sendAddToCart({
                                    product: object,
                                    quantity,
                                    url: window.location.href,
                                }).catch(error => {
                                    console.error('Failed to send AddToCart event to Meta Conversions API:', error);
                                });

                                closeModelClick();
                                closeModalFinishBuyClick();
                            }
                        }
                    />

                    <button onClick={ () => {
                        setQuantity(1);
                        handleBackButtonClick();
                    } } className="absolute top-4 left-4">
                        <MdOutlineArrowBackIos size={ 24 }/>
                    </button>
                </div>
            ) }
        </div>
    );
};

export default DynamicObjectCards;
