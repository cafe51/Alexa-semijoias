import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';
import ErrorMessage from '@/app/checkout/AddressSection/ErrorMessage';
import OptionButton from '../ProductList/VariationSelection/OptionButton';
import ProductSummary from '../ProductList/VariationSelection/ProductSummary';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import blankImage from '../../../../public/blankImage.jpg';
import Image from 'next/image';
import QuantitySelectionCartBox from '../QuantitySelectionCartBox';

interface PropertiesSelectionSectionProps {
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
    setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddToCart: (
        carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null,
        productData: ProductVariation | null,
        setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>,
        quantity?: number
    ) => void;
    currentPhase: number;
    setCurrentPhase: React.Dispatch<React.SetStateAction<number>>;
    selectedOptions: {
        [key: string]: string;
    };
    setSelectedOptions: Dispatch<SetStateAction<{
        [key: string]: string;
    }>>;
    errorMessage: string | null;
    setErrorMessage: Dispatch<SetStateAction<string | null>>;
    quantity: number;
    setQuantity: Dispatch<SetStateAction<number>>;
    availableOptions: string[];
    allOptions: string[];
    productVariationsSelected: ProductVariation[];
    keys: string[];
}

const PropertiesSelectionSection: React.FC<PropertiesSelectionSectionProps> = ({
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
            setErrorMessage(
                currentPhase === 0
                    ? `No momento estamos sem estoque para essa opção de ${keys[currentPhase]}`
                    : `No momento estamos sem estoque dessa opção de ${keys[currentPhase]} para a opção de ${keys[currentPhase - 1]} ${selectedOptions[keys[currentPhase - 1]]} escolhida`,
            );
            return;
        }

        setSelectedOptions(prev => ({ ...prev, [keys[currentPhase]]: option }));
        setErrorMessage(null);

        if (currentPhase < keys.length - 1) {
            setCurrentPhase(prev => prev + 1);
        } else {
            setCurrentPhase(keys.length); // Todas as fases completadas
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

    const removeOne = useCallback(() => setQuantity(prev => Math.max(1, prev - 1)), [setQuantity]);
    const addOne = useCallback(() => setQuantity(prev => Math.min(maxAvailableQuantity, prev + 1)), [setQuantity, maxAvailableQuantity]);

    // Reset quantity when selected variation changes
    React.useEffect(() => {
        setQuantity(1);
    }, [productVariationsSelected, setQuantity]);

    return (
        <div className="">
            { errorMessage && <ErrorMessage message={ errorMessage } /> }
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
                        <h2>{ keys[currentPhase] + ':' }</h2>
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
                    />
                </div>
            ) }
        </div>
    );
};

export default React.memo(PropertiesSelectionSection);
