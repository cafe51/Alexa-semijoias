// app/hooks/useNewProductState.ts
import { useReducer, useCallback } from 'react';
import { UseNewProductStateType } from '../utils/types';

type ActionType = 
    | { type: 'SET_NAME', payload: string }
    | { type: 'SET_DESCRIPTION', payload: string }
    | { type: 'SET_VALUE', payload: { price: number, promotionalPrice: number, cost: number, } }
    | { type: 'SET_STOCK_TYPE', payload: 'infinite' | 'limited' }
    | { type: 'SET_STOCK_QUANTITY', payload: number }
    | { type: 'SET_SKU', payload: string }
    | { type: 'SET_BARCODE', payload: string }
    | { type: 'SET_DIMENSIONS', payload: { length: number, width: number, height: number, weight: number } }

const initialState: UseNewProductStateType = {
    name: '',
    description: '',
    value: {
        price: 0,
        promotionalPrice: 0,
        cost: 0,
    },
    stockType: 'infinite',
    stockQuantity: 0,
    sku: '',
    barcode: '',
    dimensions: { length: 0, width: 0, height: 0, weight: 0 },
};

function reducer(state: UseNewProductStateType, action: ActionType): UseNewProductStateType {
    switch (action.type) {
    case 'SET_NAME':
        return { ...state, name: action.payload };
    case 'SET_DESCRIPTION':
        return { ...state, description: action.payload };
    case 'SET_VALUE':
        return { ...state, value: action.payload };
    case 'SET_STOCK_TYPE':
        return { ...state, stockType: action.payload };
    case 'SET_STOCK_QUANTITY':
        return { ...state, stockQuantity: action.payload };
    case 'SET_SKU':
        return { ...state, sku: action.payload };
    case 'SET_BARCODE':
        return { ...state, barcode: action.payload };
    case 'SET_DIMENSIONS':
        return { ...state, dimensions: action.payload };
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

    const handleStockTypeChange = useCallback((stockType: 'infinite' | 'limited') => {
        dispatch({ type: 'SET_STOCK_TYPE', payload: stockType });
    }, []);

    const handleStockQuantityChange = useCallback((stockQuantity: number) => {
        dispatch({ type: 'SET_STOCK_QUANTITY', payload: stockQuantity });
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

    return {
        state,
        handleNameChange,
        handleDescriptionChange,
        handleValueChange,
        handleStockTypeChange,
        handleStockQuantityChange,
        handleSkuChange,
        handleBarcodeChange,
        handleDimensionsChange,
    };
}
