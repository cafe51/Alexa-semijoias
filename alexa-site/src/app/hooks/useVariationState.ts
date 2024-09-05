// app/hooks/useVariationState.ts
import { useState } from 'react';
import { UseNewProductState, VariationProductType } from '@/app/utils/types';

const emptyPv = {
    customProperties: {},
    defaultProperties: {
        imageIndex: 0,
        peso: 0,
        estoque: 0,
        dimensions: { largura: 0, altura: 0, comprimento: 0 },
        barCode: '',
        sku: '',
    },
};

export function useVariationState() {
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);
    const [showProductVariationEditionModal, setShowProductVariationEditionModal] = useState<boolean>(false);
    const [productVariationState, setProductVariationState] = useState<VariationProductType>(emptyPv);
    const [selectedProductVariation, setSelectedProductVariation] = useState<VariationProductType>(emptyPv);

    const toggleVariationEditionModal = () => setShowVariationEditionModal(prev => !prev);
    const toggleProductVariationEditionModal = () => setShowProductVariationEditionModal(prev => !prev);

    function handleRemoveVariation(v: string, variations: string[], handlers: UseNewProductState) {
        const newVariations = variations.filter((vstate) => vstate !== v);
        handlers.handleVariationsChange(newVariations);
        setProductVariationState((prevState) => {
            const newState = { ...prevState };
            delete newState.customProperties[v];
            return newState;
        });
       

        handlers.handleRemoveVariationInAllProductVariations(v);
        newVariations.length === 0 && handlers.handleClearProductVariations();
    }


    return {
        variationsState: {
            showVariationEditionModal,
            showProductVariationEditionModal,
            productVariationState,
            selectedProductVariation,
        },
        variationsHandlers: {
            setProductVariationState,
            toggleVariationEditionModal,
            toggleProductVariationEditionModal,
            setSelectedProductVariation,
            handleRemoveVariation,
        },
    };
}
