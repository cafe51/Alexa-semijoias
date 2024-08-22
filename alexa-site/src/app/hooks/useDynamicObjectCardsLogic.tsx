import { useState, useEffect } from 'react';
import { ProductBundleType, ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';

function useDynamicObjectCardsLogic(object: ProductBundleType & FireBaseDocument, carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null) {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [availableOptions, setAvailableOptions] = useState<string[]>([]);
    const [allOptions, setAllOptions] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [productVariationsSelected, setProductVariationsSelected] = useState<ProductVariation[]>([]);
    const [quantity, setQuantity] = useState(1);

    const keys = object.productVariations[0].customProperties ? Object.keys(object.productVariations[0].customProperties).sort() : [''];

    useEffect(() => {
        const pv = filterProductVariations(object, selectedOptions);
        setProductVariationsSelected(pv);
    }, [object, selectedOptions]);

    useEffect(() => {
        updateAvailableOptions();
    }, [currentPhase, selectedOptions, object]);

    function updateAvailableOptions() {
            
        const currentKey = keys[currentPhase] as string;
        const options = object.productVariations.map((variation) => {
            if(variation.customProperties) {
                return variation.customProperties[currentKey];
            } else {
                return '';
            }
                
        });
        setAllOptions([...new Set(options)]);

        const filteredOptions = options.filter(option => {
            const potentialSelection = { ...selectedOptions, [currentKey]: option };
            const potentialVariations = filterProductVariations(object, potentialSelection);
            return potentialVariations.some(variation => {
                const cartItem = carrinho?.find(item => item.skuId === variation.sku);
                return cartItem ? variation.estoque > cartItem.quantidade : variation.estoque > 0;
            });
        });

        setAvailableOptions([...new Set(filteredOptions)]);


    }

    function filterProductVariations(productBundle: ProductBundleType, selectedProperties: { [key: string]: string }): ProductVariation[] {
        return productBundle.productVariations
            .filter(variation =>{
                return Object.keys(selectedProperties)
                    .every((key) => {
                        if(variation.customProperties) {
                            return variation.customProperties[key] === selectedProperties[key];
                        } else {
                            return '';
                        }
                    });
            });
    }

    return {
        currentPhase,
        setCurrentPhase,
        selectedOptions,
        setSelectedOptions,
        availableOptions,
        allOptions,
        errorMessage,
        setErrorMessage,
        productVariationsSelected,
        keys,
        quantity,
        setQuantity,
    };
}

export default useDynamicObjectCardsLogic;
