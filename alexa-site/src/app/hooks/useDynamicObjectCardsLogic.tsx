// src/app/hooks/useDynamicObjectCardsLogic.ts
import { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductBundleType, ProductVariation, ProductCartType, FireBaseDocument } from '@/app/utils/types';

function useDynamicObjectCardsLogic(
    object: (ProductBundleType & FireBaseDocument) | null,
    carrinho: (ProductCartType & FireBaseDocument)[] | ProductCartType[] | null,
    initialSelectedOptions: { [key: string]: string } = {},
) {
    // Obtém as chaves (por exemplo, "cor", "medida", "letra") a partir de uma variação
    const keys = useMemo(() => {
        if (object && object.productVariations.length > 0 && object.productVariations[0].customProperties) {
            return Object.keys(object.productVariations[0].customProperties).sort();
        }
        return [];
    }, [object]);

    const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
    const [currentPhase, setCurrentPhase] = useState(0);
    const [availableOptions, setAvailableOptions] = useState<string[]>([]);
    const [allOptions, setAllOptions] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<React.JSX.Element | null>(null);
    const [productVariationsSelected, setProductVariationsSelected] = useState<ProductVariation[]>([]);
    const [quantity, setQuantity] = useState(1);

    // Função que filtra as variações com base nas propriedades selecionadas
    const filterProductVariations = useCallback(
        (productBundle: ProductBundleType | null, selectedProperties: { [key: string]: string }): ProductVariation[] => {
            if (!productBundle) return [];
            return productBundle.productVariations.filter(variation => {
                return Object.keys(selectedProperties).every(key => {
                    if (variation.customProperties) {
                        return variation.customProperties[key].toLowerCase() === selectedProperties[key].toLowerCase();
                    }
                    return true;
                });
            });
        },
        [],
    );

    // Processa os parâmetros iniciais: somente se TODOS os parâmetros necessários forem passados
    useEffect(() => {
        if (object && keys.length > 0) {
            console.log('CHAVES INICIAIS', Object.keys(initialSelectedOptions));    
            console.log('CHAVES DO PRODUTO', keys);
            // Se nem todas as chaves estiverem presentes, ignore os parâmetros
            if (Object.keys(initialSelectedOptions).length !== keys.length) {
                setSelectedOptions({});
                setCurrentPhase(0);
                return;
            }
            // Verifica se cada valor passado é válido
            const validOptions: { [key: string]: string } = {};
            for (const key of keys) {
                const value = initialSelectedOptions[key];
                // Se o valor estiver definido e existir em alguma variação, o aceita
                if (value && object.productVariations.some(variation =>
                    variation.customProperties && variation.customProperties[key].toLowerCase() === value.toLowerCase(),
                )) {
                    validOptions[key] = value;
                }
                // else {
                //     console.log('value', value);
                //     console.log('MAPEAMENTO', object.productVariations.map(variation => variation.customProperties));
                // }
            }

            console.log('validOptions XXXXXXXX', validOptions);

            // Se nem todas as chaves forem válidas, ignora os parâmetros
            if (Object.keys(validOptions).length !== keys.length) {
                setSelectedOptions({});
                setCurrentPhase(0);
                return;
            }
            // Agora, verifica se a combinação completa existe
            if (filterProductVariations(object, validOptions).length > 0) {

                setSelectedOptions(validOptions);
                setCurrentPhase(keys.length);
            } else {
                // Se a combinação não existir, ignora os parâmetros
                console.log('*********************************************************PAROU AQUI**********************************************************');

                setSelectedOptions({});
                setCurrentPhase(0);
            }
        }
    }, [object, initialSelectedOptions, keys, filterProductVariations]);

    // Atualiza as opções disponíveis para a propriedade atual (fase)
    const updateAvailableOptions = useCallback(() => {
        if (!object || keys.length === 0 || currentPhase >= keys.length) return;

        const currentKey = keys[currentPhase];
        // Obtém todas as opções possíveis para a chave atual
        const options = object.productVariations.map(variation =>
            variation.customProperties ? variation.customProperties[currentKey] : '',
        );
        const uniqueOptions = [...new Set(options)];
        setAllOptions(uniqueOptions);

        const availableOptionsSet = new Set<string>();

        uniqueOptions.forEach(option => {
            const potentialSelection = { ...selectedOptions, [currentKey]: option };
            const potentialVariations = filterProductVariations(object, potentialSelection);
            // A opção é considerada disponível se houver ao menos uma variação com estoque (mesmo que a combinação completa ainda não esteja selecionada)
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
