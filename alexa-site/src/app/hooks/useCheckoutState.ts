// app/hooks/useCheckoutState.ts

import { useEffect, useReducer, useCallback } from 'react';
import { AddressType, DeliveryOptionType } from '../utils/types';
import { useUserInfo } from '../hooks/useUserInfo';

// Define action types
type ActionType = 
  | { type: 'SET_EDITING_ADDRESS_MODE', payload: boolean }
  | { type: 'SET_SELECTED_DELIVERY_OPTION', payload: string | null }
  | { type: 'SET_DELIVERY_OPTION', payload: DeliveryOptionType | null }
  | { type: 'SET_ADDRESS', payload: AddressType };

// Define state type
type StateType = {
  editingAddressMode: boolean;
  selectedDeliveryOption: string | null;
  deliveryOption: DeliveryOptionType | null;
  address: AddressType;
};

// Initial state
const initialState: StateType = {
    editingAddressMode: false,
    selectedDeliveryOption: null,
    deliveryOption: null,
    address: {
        bairro: '',
        cep: '',
        complemento: '',
        ddd: '',
        gia: '',
        ibge: '',
        localidade: '',
        logradouro: '',
        numero: '',
        siafi: '',
        uf: '',
        unidade: '',
        referencia: '',
    },
};

// Reducer function
function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
    case 'SET_EDITING_ADDRESS_MODE':
        return { ...state, editingAddressMode: action.payload };
    case 'SET_SELECTED_DELIVERY_OPTION':
        return { ...state, selectedDeliveryOption: action.payload };
    case 'SET_DELIVERY_OPTION':
        return { ...state, deliveryOption: action.payload };
    case 'SET_ADDRESS':
        return { ...state, address: action.payload };
    default:
        return state;
    }
}

// Custom hook
export function useCheckoutState() {
    const [state, dispatch] = useReducer(reducer, initialState);
    const { userInfo } = useUserInfo();
  
    const deliveryOptions = [
        { name: 'PAC', deliveryTime: 22, price: 29.45 },
        { name: 'Sedex', deliveryTime: 1, price: 56.31 },
    ];

    useEffect(() => {
        console.log('selectedDeliveryOption', state.selectedDeliveryOption);
        const foundDeliveryOption = deliveryOptions.find(option => state.selectedDeliveryOption === option.name);
        dispatch({ type: 'SET_DELIVERY_OPTION', payload: foundDeliveryOption || null });
    }, [state.selectedDeliveryOption]);

    useEffect(() => {
        if (userInfo && userInfo.address) {
            dispatch({ type: 'SET_ADDRESS', payload: userInfo.address });
        }
    }, [userInfo]);

    const handleAddressChange = useCallback((newAddress: AddressType) => {
        dispatch({ type: 'SET_ADDRESS', payload: newAddress });
    }, []);

    const handleEditingAddressMode = useCallback((mode: boolean) => {
        dispatch({ type: 'SET_EDITING_ADDRESS_MODE', payload: mode });
    }, []);

    const handleSelectedDeliveryOption = useCallback((option: string | null) => {
        dispatch({ type: 'SET_SELECTED_DELIVERY_OPTION', payload: option });
    }, []);

    return {
        state,
        handleAddressChange,
        handleEditingAddressMode,
        handleSelectedDeliveryOption,
        deliveryOptions,
    };
}
