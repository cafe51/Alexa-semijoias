import React from 'react';
import useDynamicObjectCardsLogic from '@/app/hooks/useDynamicObjectCardsLogic';
import OptionButton from './OptionButton';
import ErrorMessage from './ErrorMessage';
import ProductSummary from './ProductSummary';
import { ProductBundleType, ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';

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
}

const DynamicObjectCards: React.FC<DynamicObjectCardsProps> = ({ object, handleAddToCart, carrinho, setIsloadingButton, closeModelClick, closeModalFinishBuyClick }) => {
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

    const isDisabled = () => {
        const cartItem = carrinho?.find(item => item.skuId === productVariationsSelected[0]?.sku);
        return productVariationsSelected.length !== 1 || (cartItem && productVariationsSelected[0].estoque <= cartItem.quantidade);
    };

    return (
        <div className="p-4">
            <ErrorMessage message={ errorMessage } />
            { currentPhase < keys.length ? (
                <>
                    <h2>{ keys[currentPhase] }</h2>
                    <div className="flex flex-wrap gap-2">
                        { allOptions.map((option, index) => (
                            <OptionButton key={ index } option={ option } isAvailable={ availableOptions.includes(option) } handleOptionSelect={ handleOptionSelect } />
                        )) }
                    </div>
                    { currentPhase > 0 && (
                        <button onClick={ handleBackButtonClick } className="absolute top-4 left-4">
              &#8592; Voltar
                        </button>
                    ) }
                </>
            ) : (
                <>
                    <h2>Quantidade</h2>
                    <ProductSummary selectedOptions={ selectedOptions } />
                    <div className="flex items-center secColor rounded">
                        <button
                            className="px-4 py-1 text-white text-lg primColor rounded hover:bg-pink-400 border-solid border-2 borderColor disabled:bg-pink-200"
                            onClick={ (quantity <= 1) ? (() => null) : () => setQuantity((prevQuantity) => prevQuantity -= 1) }
                            disabled={ quantity <= 1 }
                        >
                        -
                        </button>
                        <span className="px-4 p-1 bg-white gray-300 border-solid border-2 borderColor border-x-0" >
                            { quantity }
                        </span>
                        <button
                            className="px-4 py-1  text-white text-lg primColor rounded hover:bg-pink-400 border-solid border-2 borderColor disabled:bg-pink-200"
                            onClick={ (quantity >= productVariationsSelected[0].estoque) ? (() => null) : () => setQuantity((prevQuantity) => prevQuantity += 1) }
                            disabled={ quantity >= productVariationsSelected[0].estoque }
                        >
                        +
                        </button>
                    </div>
                    <button
                        className="bg-blue-500 p-2 mt-4 text-white disabled:bg-gray-300 disabled:text-gray-500"
                        onClick={ () => {
                            productVariationsSelected.length === 1 && handleAddToCart(carrinho, productVariationsSelected[0], setIsloadingButton, quantity);
                            closeModelClick();
                            closeModalFinishBuyClick();
                        } }
                        disabled={ isDisabled() }
                    >
            Comprar
                    </button>
                    <button onClick={ handleBackButtonClick } className="absolute top-4 left-4">
            &#8592; Voltar
                    </button>
                </>
            ) }
        </div>
    );
};

export default DynamicObjectCards;
