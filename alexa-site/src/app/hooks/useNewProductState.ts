// app/hooks/useNewProductState.ts
import { useReducer, useCallback } from 'react';
import { ImageProductDataType, MoreOptionsType, SectionType, StateNewProductType, UseNewProductState, VariationProductType, VideoProductDataType } from '../utils/types';
import { Timestamp } from 'firebase/firestore';

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
    | { type: 'SET_DIMENSIONS', payload: { largura: number, altura: number, comprimento: number, peso: number } }
    | { type: 'SET_SECTIONS_SITE', payload: SectionType[] | never[] }
    | { type: 'SET_SECTIONS', payload: string[] }
    | { type: 'SET_SUB_SECTIONS', payload: string[] | undefined }

    | { type: 'SET_ADD_CATEGORIES', payload: string }
    | { type: 'SET_FB_CATEGORIES', payload: string[] }
    | { type: 'SET_REMOVE_CATEGORY', payload: string }
    | { type: 'SET_REMOVE_ALL_CATEGORIES' }

    | { type: 'SET_ADD_COLLECTIONS', payload: string }
    | { type: 'SET_FB_COLLECTIONS', payload: string[] }
    | { type: 'SET_REMOVE_COLLECTION', payload: string }
    | { type: 'SET_REMOVE_ALL_COLLECTIONS' }

    | { type: 'SET_IMAGES', payload: ImageProductDataType[] }
    | { type: 'SET_VIDEO', payload: VideoProductDataType | null }
    | { type: 'SET_MORE_OPTIONS', payload: MoreOptionsType[] }
    | { type: 'SET_CREATION_DATE', payload: Timestamp }
    | { type: 'SET_UPDATING_DATE', payload: Timestamp }



export const initialEmptyState: StateNewProductType = {
    name: '',
    categories: [],
    categoriesFromFirebase: [],
    collections: [],
    collectionsFromFirebase: [],
    description: '',
    value: {
        price: 0,
        promotionalPrice: 0,
        cost: 0,
    },
    sectionsSite: [],
    sections: [],
    subsections: undefined,
    variations: [],
    productVariations: [],
    estoque: undefined,
    sku: undefined,
    barcode: undefined,
    dimensions: undefined,
    images: [],
    video: null,
    moreOptions: [
        { isChecked: true, label: 'Exibir na minha loja', property: 'showProduct' },
        { isChecked: false, label: 'Esse produto possui frete grátis', property: 'freeShipping' },
        { isChecked: false, label: 'Marcar como lancamento', property: 'lancamento' },
    ],
    creationDate: Timestamp.now(),
    updatingDate: Timestamp.now(),
};

function reducer(state: StateNewProductType, action: ActionType): StateNewProductType {
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
            return { ...state, productVariations: [action.payload, ...state.productVariations] };
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
                productVariations: state.productVariations.map((pv) => ({
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
                productVariations: state.productVariations.map((pv) => {
                    const newProductVariation = { ...pv };
                    delete newProductVariation.customProperties[action.payload];
                    return newProductVariation;
                }),
            };
        case 'SET_STOCK_QUANTITY':
            return { ...state, estoque: action.payload };
        case 'SET_SKU':
            return { ...state, sku: action.payload };
        case 'SET_BARCODE':
            return { ...state, barcode: action.payload };
        case 'SET_DIMENSIONS':
            return { ...state, dimensions: action.payload };
        case 'SET_SECTIONS_SITE':
            return { ...state, sectionsSite: action.payload };
        case 'SET_SECTIONS':
            return { ...state, sections: action.payload };
        case 'SET_SUB_SECTIONS':
            return { ...state, subsections: action.payload };

        case 'SET_ADD_CATEGORIES':
            return { ...state, categories: [action.payload, ...state.categories] };
        case 'SET_FB_CATEGORIES':
            return { ...state, categoriesFromFirebase: action.payload };
        case 'SET_REMOVE_CATEGORY':
            return { ...state, categories: state.categories.filter((c) => c !== action.payload) };
        case 'SET_REMOVE_ALL_CATEGORIES':
            return { ...state, categories: [] };

        case 'SET_ADD_COLLECTIONS':
            return { ...state, collections: [action.payload, ...state.collections] };
        case 'SET_FB_COLLECTIONS':
            return { ...state, collectionsFromFirebase: action.payload };
        case 'SET_REMOVE_COLLECTION':
            return { ...state, collections: state.collections.filter((c) => c !== action.payload) };
        case 'SET_REMOVE_ALL_COLLECTIONS':
            return { ...state, collections: [] };

        case 'SET_IMAGES':
            return { ...state, images: action.payload };
        case 'SET_MORE_OPTIONS':
            return { ...state, moreOptions: action.payload };
        case 'SET_CREATION_DATE':
            return { ...state, creationDate: action.payload };
        case 'SET_UPDATING_DATE':
            return { ...state, updatingDate: action.payload };
        case 'SET_VIDEO':
            return { ...state, video: action.payload };
        default:
            return state;
    }
}

export function useNewProductState(initialState: StateNewProductType = initialEmptyState) {
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

    const handleStockQuantityChange = useCallback((estoque: number | undefined) => {
        dispatch({ type: 'SET_STOCK_QUANTITY', payload: estoque });
    }, []);

    const handleAddProductVariation = useCallback((productVariation: VariationProductType) => {
        dispatch({ type: 'ADD_PRODUCT_VARIATION', payload: productVariation });
    }, []);

    const handleClearProductVariations = useCallback(() => {
        dispatch({ type: 'CLEAR_PRODUCT_VARIATIONS' });
    }, []);

    const handleRemoveProductVariation = useCallback((productVariation: VariationProductType) => {
        dispatch({ type: 'REMOVE_PRODUCT_VARIATION', payload: productVariation });
    }, []);

    const handleUpdateProductVariation = useCallback((oldVariation: VariationProductType, newVariation: VariationProductType) => {
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

    const handleDimensionsChange = useCallback((dimensions: { largura: number, altura: number, comprimento: number, peso: number }) => {
        dispatch({ type: 'SET_DIMENSIONS', payload: dimensions });
    }, []);

    const handleAddSectionsSite = useCallback((sections: SectionType[] | never[]) => {
        dispatch({ type: 'SET_SECTIONS_SITE', payload: sections });
    }, []);

    const handleAddSection = useCallback((sections: string[]) => {
        dispatch({ type: 'SET_SECTIONS', payload: sections });
    }, []);

    const handleAddSubSection = useCallback((sections: string[] | undefined) => {
        dispatch({ type: 'SET_SUB_SECTIONS', payload: sections });
    }, []);

    const handleAddCategories = useCallback((category: string) => {
        dispatch({ type: 'SET_ADD_CATEGORIES', payload: category });
    }, []);

    const handleSetCategoriesFromFb = useCallback((categories: string[]) => {
        dispatch({ type: 'SET_FB_CATEGORIES', payload: categories });
    }, []);

    const handleRemoveCategory = useCallback((category: string) => {
        dispatch({ type: 'SET_REMOVE_CATEGORY', payload: category });
    }, []);

    const handleRemoveAllCategories = useCallback(() => {
        dispatch({ type: 'SET_REMOVE_ALL_CATEGORIES' });
    }, []);



    const handleAddCollections = useCallback((collection: string) => {
        dispatch({ type: 'SET_ADD_COLLECTIONS', payload: collection });
    }, []);

    const handleSetCollectionsFromFb = useCallback((collection: string[]) => {
        dispatch({ type: 'SET_FB_COLLECTIONS', payload: collection });
    }, []);

    const handleRemoveCollection = useCallback((collection: string) => {
        dispatch({ type: 'SET_REMOVE_COLLECTION', payload: collection });
    }, []);

    const handleRemoveAllCollections = useCallback(() => {
        dispatch({ type: 'SET_REMOVE_ALL_COLLECTIONS' });
    }, []);




    const handleSetImages = useCallback((images: ImageProductDataType[]) => {
        dispatch({ type: 'SET_IMAGES', payload: images });
    }, []);

    const handleSetMoreOptions = useCallback((moreOptions: MoreOptionsType[]) => {
        dispatch({ type: 'SET_MORE_OPTIONS', payload: moreOptions });
    }, []);

    const handleSetCreationDate = useCallback((creationDate: Timestamp) => {
        dispatch({ type: 'SET_CREATION_DATE', payload: creationDate });
    }, []);

    const handleSetUpdatingDate = useCallback((updatingDate: Timestamp) => {
        dispatch({ type: 'SET_UPDATING_DATE', payload: updatingDate });
    }, []);

    const handlers: UseNewProductState = {
        handleSetVideo: (video: VideoProductDataType | null) => {
            dispatch({ type: 'SET_VIDEO', payload: video });
        },
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
        handleAddSectionsSite,
        handleAddSection,
        handleAddSubSection,
        handleAddCategories,
        handleSetCategoriesFromFb,
        handleRemoveCategory,
        handleRemoveAllCategories,
        handleSetImages,
        handleSetMoreOptions,
        handleSetCreationDate,
        handleSetUpdatingDate,

        handleAddCollections,
        handleSetCollectionsFromFb,
        handleRemoveCollection,
        handleRemoveAllCollections,

    };

    return {
        state,
        handlers,
    };
}
