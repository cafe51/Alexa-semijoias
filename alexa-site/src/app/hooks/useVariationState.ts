// app/hooks/useVariationState.ts
import { useState } from 'react';
import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import deepEqual from '../utils/deepEqual';

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

function removeCustomVariationInAllElementsOfTheArray(arrayOfProducts: VariationProductType[], customProductKey: string): VariationProductType[] {
    const res = arrayOfProducts.map((pv) =>{
        const newProductVariation = { ...pv };
        delete newProductVariation.customProperties[customProductKey];
        return newProductVariation;
    });
    return res;
}

function removeDuplicateCustomProperties(arrayOfProducts: VariationProductType[], handlers: UseNewProductState, v: string) {
    const uniqueProducts: VariationProductType[] = [];

    removeCustomVariationInAllElementsOfTheArray(arrayOfProducts, v).forEach((product) => {
        const hasDuplicate = uniqueProducts.some((uniqueProduct) => 
            deepEqual(product.customProperties, uniqueProduct.customProperties),
        );
    
        if (!hasDuplicate) {
            uniqueProducts.push(product);
        }
    });

    handlers.handleClearProductVariations(); // apaga todos os pv do estado
    console.log('uniqueProducts', uniqueProducts);
    uniqueProducts.forEach((fpv) => { // recria o estado adicionando cada um dos pv filtrados
        console.log('fpv', fpv);
        handlers.handleAddProductVariation(fpv);
    });

}

export function useVariationState() {
    const [showVariationEditionModal, setShowVariationEditionModal] = useState<boolean>(false);
    const [showProductVariationEditionModal, setShowProductVariationEditionModal] = useState<boolean>(false);
    const [productVariationState, setProductVariationState] = useState<VariationProductType>(emptyPv);
    const [selectedProductVariation, setSelectedProductVariation] = useState<VariationProductType>(emptyPv);

    const toggleVariationEditionModal = () => setShowVariationEditionModal(prev => !prev);
    const toggleProductVariationEditionModal = () => setShowProductVariationEditionModal(prev => !prev);

    function handleRemoveVariation(v: string, variations: string[], handlers: UseNewProductState, state: StateNewProductType) {
        const newVariations = variations.filter((vstate) => vstate !== v);
        handlers.handleVariationsChange(newVariations);
        setProductVariationState((prevState) => {
            const newState = { ...prevState };
            delete newState.customProperties[v];
            return newState;
        });
       
        newVariations.length === 0 && handlers.handleClearProductVariations();

        newVariations.length > 0 && removeDuplicateCustomProperties(state.productVariations, handlers, v);
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
