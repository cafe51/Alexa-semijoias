import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductBundleType, ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';

function useDynamicObjectCardsLogic(object: (ProductBundleType & FireBaseDocument) | null, carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null) {
    const [currentPhase, setCurrentPhase] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [availableOptions, setAvailableOptions] = useState<string[]>([]);
    const [allOptions, setAllOptions] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [productVariationsSelected, setProductVariationsSelected] = useState<ProductVariation[]>([]);
    const [quantity, setQuantity] = useState(1);

    const keys = useMemo(() => {
        if (object && object.productVariations[0].customProperties) {
            return Object.keys(object.productVariations[0].customProperties).sort();
        }
        return [''];
    }, [object]);

    const filterProductVariations = useCallback((productBundle: ProductBundleType | null, selectedProperties: { [key: string]: string }): ProductVariation[] => {
        if (!productBundle) {
            return [];
        }
        return productBundle.productVariations
            .filter(variation => {
                return Object.keys(selectedProperties)
                    .every((key) => {
                        if (variation.customProperties) {
                            return variation.customProperties[key] === selectedProperties[key];
                        } else {
                            return true;
                        }
                    });
            });
    }, []);

    const updateAvailableOptions = useCallback(() => {
        if (!object) return;

        const currentKey = keys[currentPhase];
        const options = object.productVariations.map((variation) => {
            if (variation.customProperties) {
                return variation.customProperties[currentKey];
            } else {
                return '';
            }
        });
        const uniqueOptions = [...new Set(options)];
        setAllOptions(uniqueOptions);

        const availableOptionsSet = new Set<string>();

        uniqueOptions.forEach(option => {
            const potentialSelection = { ...selectedOptions, [currentKey]: option };
            const potentialVariations = filterProductVariations(object, potentialSelection);
            const isAvailable = potentialVariations.some(variation => {
                const cartItem = carrinho?.find(item => item.skuId === variation.sku);
                return cartItem ? variation.estoque > cartItem.quantidade : variation.estoque > 0;
            });

            if (isAvailable) {
                availableOptionsSet.add(option);
            }
        });

        setAvailableOptions(Array.from(availableOptionsSet));
    }, [object, currentPhase, selectedOptions, keys, carrinho, filterProductVariations]);

    useEffect(() => {
        if (object) {
            const pv = filterProductVariations(object, selectedOptions);
            setProductVariationsSelected(pv);
        }
    }, [object, selectedOptions, filterProductVariations]);

    useEffect(() => {
        if (object) {
            updateAvailableOptions();
        }
    }, [object, updateAvailableOptions]);

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
