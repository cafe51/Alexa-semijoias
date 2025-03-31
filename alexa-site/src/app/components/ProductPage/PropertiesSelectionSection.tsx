import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { sendGTMEvent } from '@/app/utils/analytics';
import { ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';
import OptionButton from '../ProductList/VariationSelection/OptionButton';
import ProductSummary from '../ProductList/VariationSelection/ProductSummary';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import blankImage from '../../../../public/blankImage.png';
import Image from 'next/image';
import QuantitySelectionCartBox from '../QuantitySelectionCartBox';
import toTitleCase from '@/app/utils/toTitleCase';
import OutOfStockMessage from '../ProductList/OutOfStockMessage';
import StockWarning from './StockWarning';

interface PropertiesSelectionSectionProps {
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
    isLoadingButton: boolean;
    currentPhase: number;
    setCurrentPhase: React.Dispatch<React.SetStateAction<number>>;
    selectedOptions: { [key: string]: string };
    setSelectedOptions: Dispatch<SetStateAction<{ [key: string]: string }>>;
    errorMessage: React.JSX.Element | null;
    setErrorMessage: Dispatch<SetStateAction<React.JSX.Element | null>>;
    quantity: number;
    setQuantity: Dispatch<SetStateAction<number>>;
    availableOptions: string[];
    allOptions: string[];
    productVariationsSelected: ProductVariation[];
    keys: string[];
}

const PropertiesSelectionSection: React.FC<PropertiesSelectionSectionProps> = ({
    isLoadingButton,
    currentPhase, setCurrentPhase,
    selectedOptions, setSelectedOptions,
    errorMessage, setErrorMessage,
    quantity, setQuantity,
    availableOptions,
    allOptions,
    productVariationsSelected,
    keys,
    carrinho,
}) => {
    const handleOptionSelect = useCallback((option: string) => {
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

        setSelectedOptions(prev => ({ ...prev, [keys[currentPhase]]: option }));
        setErrorMessage(null);

        if (currentPhase < keys.length - 1) {
            setCurrentPhase(prev => prev + 1);
        } else {
            // Todas as fases completadas
            setCurrentPhase(keys.length);
            
            // Rastrear conclusão da seleção de todas as opções
            const allSelections = { ...selectedOptions, [keys[currentPhase]]: option };


            sendGTMEvent('select_complete', {
                ecommerce: {
                    selections: allSelections,
                },
            });
        }
    }, [availableOptions, currentPhase, keys, selectedOptions, setCurrentPhase, setErrorMessage, setSelectedOptions]);

    const handleBackButtonClick = useCallback(() => {
        if (currentPhase > 0) {
            const previousPhase = currentPhase - 1;
            const previousKey = keys[previousPhase];
            setSelectedOptions(prev => {
                const updatedOptions = { ...prev };
                delete updatedOptions[previousKey];
                return updatedOptions;
            });
            setCurrentPhase(previousPhase);
        }
    }, [currentPhase, keys, setCurrentPhase, setSelectedOptions]);

    const isSelectionPhase = useMemo(() => currentPhase < keys.length, [currentPhase, keys.length]);

    const maxAvailableQuantity = useMemo(() => {
        if (productVariationsSelected.length === 1) {
            const selectedVariation = productVariationsSelected[0];
            const cartItem = carrinho?.find(item => item.skuId === selectedVariation.sku);
            const quantityInCart = cartItem ? cartItem.quantidade : 0;
            return Math.max(0, selectedVariation.estoque - quantityInCart);
        }
        return 0;
    }, [productVariationsSelected, carrinho]);

    const removeOne = useCallback(() => {
        setQuantity(prev => {
            const newQuantity = Math.max(1, prev - 1);
            if (productVariationsSelected.length === 1) {
                sendGTMEvent('adjust_quantity', {
                    ecommerce: {
                        action: 'decrease',
                        item_id: productVariationsSelected[0].sku,
                        from_quantity: prev,
                        to_quantity: newQuantity,
                    },
                });
            }
            return newQuantity;
        });
    }, [setQuantity, productVariationsSelected]);

    const addOne = useCallback(() => {
        setQuantity(prev => {
            const newQuantity = Math.min(maxAvailableQuantity, prev + 1);
            if (productVariationsSelected.length === 1) {
                sendGTMEvent('adjust_quantity', {
                    ecommerce: {
                        action: 'increase',
                        item_id: productVariationsSelected[0].sku,
                        from_quantity: prev,
                        to_quantity: newQuantity,
                    },
                });
            }
            return newQuantity;
        });
    }, [setQuantity, maxAvailableQuantity, productVariationsSelected]);

    // Reset quantity when selected variation changes
    React.useEffect(() => {
        setQuantity(1);
    }, [productVariationsSelected, setQuantity]);

    return (
        <div className="">
            { isSelectionPhase ? (
                <div className='flex flex-col gap-4'>
                    <div className='flex gap-2'>
                        { currentPhase > 0 && (
                            <button onClick={ () => {
                                setQuantity(1);
                                handleBackButtonClick();
                            } } className="">
                                <MdOutlineArrowBackIos size={ 24 }/>
                            </button>
                        ) }
                        <p className='text-2xl'>{ toTitleCase(keys[currentPhase]) + ':' }</p>
                    </div>

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

                    { errorMessage && <OutOfStockMessage message={ errorMessage } /> }

                </div>
            ) : (
                <div className='flex flex-col gap-4 items-center justify-center'>
                    <div className='flex self-start gap-2'>
                        <button onClick={ () => {
                            setQuantity(1);
                            handleBackButtonClick();
                        } } className="">
                            <MdOutlineArrowBackIos size={ 24 }/>
                        </button>
                        <h2>Quantidade</h2>
                    </div>
          
                    <div className='flex gap-4 w-full h-[90px] '>
                        <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                            <Image
                                className='rounded-lg object-cover scale-100'
                                src={ productVariationsSelected[0].image ? productVariationsSelected[0].image : blankImage }
                                alt="Foto da peça"
                                sizes='200px'
                                fill
                            />
                        </div>
                        <ProductSummary selectedOptions={ selectedOptions } />
                    </div>
                    <QuantitySelectionCartBox
                        quantity={ quantity }
                        removeOne={ removeOne }
                        addOne={ addOne }
                        stock={ maxAvailableQuantity }
                        isLoadingButton={ isLoadingButton }
                    />

                    { maxAvailableQuantity <= 3 && <StockWarning stock={ maxAvailableQuantity } /> }
                </div>
            ) }
        </div>
    );
};

export default React.memo(PropertiesSelectionSection);
