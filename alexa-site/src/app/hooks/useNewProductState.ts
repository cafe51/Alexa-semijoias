// app/hooks/useNewProductState.ts
import { useReducer, useCallback } from 'react';
import { SectionType, UseNewProductStateType, VariationProductType } from '../utils/types';

type ActionType =
    | { type: 'SET_NAME', payload: string }
    | { type: 'SET_DESCRIPTION', payload: string }
    | { type: 'SET_VALUE', payload: { price: number, promotionalPrice: number, cost: number, } }
    | { type: 'SET_STOCK_QUANTITY', payload: number | undefined }
    | { type: 'ADD_PRODUCT_VARIATION', payload: VariationProductType }
    | { type: 'CLEAR_PRODUCT_VARIATIONS' }
    | { type: 'REMOVE_PRODUCT_VARIATION', payload: VariationProductType }
    | { type: 'UPDATE_PRODUCT_VARIATION', payload: { newVariation: VariationProductType, oldVariation: VariationProductType } }
    | { type: 'ADD_NEW_VARIATION_IN_ALL_PRODUCTS_VARIATIONS', payload: string }
    | { type: 'REMOVE_A_VARIATION_IN_ALL_PRODUCTS_VARIATIONS', payload: string }
    | { type: 'SET_VARIATIONS', payload: string[] | never[] }
    | { type: 'SET_SKU', payload: string }
    | { type: 'SET_BARCODE', payload: string }
    | { type: 'SET_DIMENSIONS', payload: { length: number, width: number, height: number, weight: number } }
    | { type: 'SET_SECTIONS', payload: SectionType[] | never[] }

const initialState: UseNewProductStateType = {
    name: '',
    description: '',
    value: {
        price: 0,
        promotionalPrice: 0,
        cost: 0,
    },
    variations: [],
    stockQuantity: 0,
    sku: '',
    barcode: '',
    dimensions: { length: 0, width: 0, height: 0, weight: 0 },
    productVariations: [],
    sectionsSite: [],
};

function reducer(state: UseNewProductStateType, action: ActionType): UseNewProductStateType {
    switch (action.type) {
    case 'SET_NAME':
        return { ...state, name: action.payload };
    case 'SET_DESCRIPTION':
        return { ...state, description: action.payload };
    case 'SET_VALUE':
        return { ...state, value: action.payload };
    case 'SET_VARIATIONS':
        return { ...state, variations: action.payload };
    case 'ADD_PRODUCT_VARIATION':
        return { ...state, productVariations: [...state.productVariations, action.payload] };
    case 'CLEAR_PRODUCT_VARIATIONS':
        return { ...state, productVariations: [] };
    case 'REMOVE_PRODUCT_VARIATION':
        return { ...state, productVariations: state.productVariations.filter((pv) => pv !== action.payload) };
    case 'UPDATE_PRODUCT_VARIATION':
        return {
            ...state,
            productVariations: state.productVariations.map((pv) =>
                pv === action.payload.oldVariation ? action.payload.newVariation : pv,
            ),
        };
    case 'ADD_NEW_VARIATION_IN_ALL_PRODUCTS_VARIATIONS':
        return {
            ...state,
            productVariations: state.productVariations.map((pv) =>({
                ...pv,
                customProperties: {
                    ...pv.customProperties,
                    [action.payload]: '',
                },
            })),
        };
    case 'REMOVE_A_VARIATION_IN_ALL_PRODUCTS_VARIATIONS':
        return {
            ...state,
            productVariations: state.productVariations.map((pv) =>{
                const newProductVariation = { ...pv };
                delete newProductVariation.customProperties[action.payload];
                return newProductVariation;
            }),
        };
    case 'SET_STOCK_QUANTITY':
        return { ...state, stockQuantity: action.payload };
    case 'SET_SKU':
        return { ...state, sku: action.payload };
    case 'SET_BARCODE':
        return { ...state, barcode: action.payload };
    case 'SET_DIMENSIONS':
        return { ...state, dimensions: action.payload };
    case 'SET_SECTIONS':
        return { ...state, sectionsSite: action.payload };
    default:
        return state;
    }
}

export function useNewProductState() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleNameChange = useCallback((name: string) => {
        dispatch({ type: 'SET_NAME', payload: name });
    }, []);
    
    const handleDescriptionChange = useCallback((description: string) => {
        dispatch({ type: 'SET_DESCRIPTION', payload: description });
    }, []);

    const handleValueChange = useCallback((value: { price: number, promotionalPrice: number, cost: number, }) => {
        dispatch({ type: 'SET_VALUE', payload: value });
    }, []);

    const handleStockQuantityChange = useCallback((stockQuantity: number) => {
        dispatch({ type: 'SET_STOCK_QUANTITY', payload: stockQuantity });
    }, []);
    
    const handleAddProductVariation = useCallback((productVariation: any) => {
        dispatch({ type: 'ADD_PRODUCT_VARIATION', payload: productVariation });
    }, []);

    const handleClearProductVariations = useCallback(() => {
        dispatch({ type: 'CLEAR_PRODUCT_VARIATIONS' });
    }, []);

    const handleRemoveProductVariation = useCallback((productVariation: any) => {
        dispatch({ type: 'REMOVE_PRODUCT_VARIATION', payload: productVariation });
    }, []);
    
    const handleUpdateProductVariation = useCallback((oldVariation: any, newVariation: any) => {
        dispatch({ type: 'UPDATE_PRODUCT_VARIATION', payload: { oldVariation, newVariation } });
    }, []);
    
    const handleVariationsChange = useCallback((variations: string[] | never[]) => {
        dispatch({ type: 'SET_VARIATIONS', payload: variations });
    }, []);

    const handleAddNewVariationInAllProductVariations = useCallback((newVariation: string) => {
        dispatch({ type: 'ADD_NEW_VARIATION_IN_ALL_PRODUCTS_VARIATIONS', payload: newVariation });
    }, []);

    const handleRemoveVariationInAllProductVariations = useCallback((variationToBeRemoved: string) => {
        dispatch({ type: 'REMOVE_A_VARIATION_IN_ALL_PRODUCTS_VARIATIONS', payload: variationToBeRemoved });
    }, []);

    const handleSkuChange = useCallback((sku: string) => {
        dispatch({ type: 'SET_SKU', payload: sku });
    }, []);

    const handleBarcodeChange = useCallback((barcode: string) => {
        dispatch({ type: 'SET_BARCODE', payload: barcode });
    }, []);

    const handleDimensionsChange = useCallback((dimensions: { length: number, width: number, height: number, weight: number }) => {
        dispatch({ type: 'SET_DIMENSIONS', payload: dimensions });
    }, []);

    const handleAddSection = useCallback((sections: SectionType[] | never[]) => {
        dispatch({ type: 'SET_SECTIONS', payload: sections });
    }, []);


    return {
        state,
        handleNameChange,
        handleDescriptionChange,
        handleValueChange,
        handleStockQuantityChange,
        handleVariationsChange,
        handleSkuChange,
        handleBarcodeChange,
        handleDimensionsChange,
        handleAddProductVariation,
        handleClearProductVariations,
        handleRemoveProductVariation,
        handleUpdateProductVariation,
        handleAddNewVariationInAllProductVariations,
        handleRemoveVariationInAllProductVariations,
        handleAddSection,
    };
}
