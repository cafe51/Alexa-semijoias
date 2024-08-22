import React, { Dispatch, SetStateAction } from 'react';
import { ProductBundleType, ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';
import ErrorMessage from '@/app/checkout/AddressSection/ErrorMessage';
import OptionButton from '../ProductList/OptionButton';
import ProductSummary from '../ProductList/ProductSummary';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import SelectingQuantityBox from '../SelectingQuantityBox';


interface PropertiesSelectionSectionProps {
  object: ProductBundleType & FireBaseDocument;
  carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null;
  setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>;
  handleAddToCart: (
    (carrinho: ((ProductCartType & FireBaseDocument)[]) | ProductCartType[] | null,
    productData: ProductVariation | null,
    setIsloadingButton: React.Dispatch<React.SetStateAction<boolean>>,
    quantity?: number) => void);
    currentPhase: number;
    setCurrentPhase:  React.Dispatch<React.SetStateAction<number>>;
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

const PropertiesSelectionSection: React.FC<PropertiesSelectionSectionProps> = (
    {
        object,
        currentPhase, setCurrentPhase,
        selectedOptions, setSelectedOptions,
        errorMessage, setErrorMessage,
        quantity, setQuantity,
        availableOptions,
        allOptions,
        productVariationsSelected,
        keys,
    },
) => {


    if (object.productVariations.some((pv) => pv.customProperties === undefined)) {
        return <p>Olá</p>;
    }
  

    const handleOptionSelect = (option: string) => {
        if (!availableOptions.includes(option)) {
            setErrorMessage(
                currentPhase === 0
                    ? `No momento estamos sem estoque para essa opção de ${keys[currentPhase]}`
                    : `No momento estamos sem estoque dessa opção de ${keys[currentPhase]} para a opção de ${keys[currentPhase - 1]} ${selectedOptions[keys[currentPhase - 1]]} escolhida`,
            );
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
    };



    return (
        <div className="">
            { errorMessage && <ErrorMessage message={ errorMessage } /> }
            { currentPhase < keys.length ? (
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
                        <h2>{ keys[currentPhase] }</h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        { allOptions.map((option, index) => (
                            <OptionButton key={ index } option={ option } isAvailable={ availableOptions.includes(option) } handleOptionSelect={ handleOptionSelect } />
                        )) }
                    </div>

                </div>
            ) : (
                <div className='flex flex-col gap-4'>

                    <div className='flex gap-2'>
                        <button onClick={ () => {
                            setQuantity(1);
                            handleBackButtonClick();
                        } } className="">
                            <MdOutlineArrowBackIos size={ 24 }/>
                        </button>
                        <h2>Quantidade</h2>
                    </div>
                    
                    <div className='flex gap-2 border'>
                        <ProductSummary selectedOptions={ selectedOptions } />
                        <SelectingQuantityBox
                            quantity={ quantity }
                            removeOne={ () =>  setQuantity((prevQuantity) => prevQuantity -= 1) }
                            addOne={ () => setQuantity((prevQuantity) => prevQuantity += 1) }
                            stock={ productVariationsSelected[0].estoque }
                        />
                    </div>
                </div>
            ) }
        </div>
    );
};

export default PropertiesSelectionSection;
