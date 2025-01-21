// app/hooks/useCheckoutState.ts
import { useEffect, useReducer, useCallback, useState } from 'react';
import { AddressType, DeliveryOptionType, UseCheckoutStateType } from '../utils/types';
import { useUserInfo } from '../hooks/useUserInfo';
import getShippingOptions from '../utils/getShippingOptions';

// Define action types
type ActionType = 
    | { type: 'SET_SHOW_FULL_ORDER_SUMMARY', payload: boolean }
    | { type: 'SET_SHOW_LOGIN_SECTION', payload: boolean }
    | { type: 'SET_EDITING_ADDRESS_MODE', payload: boolean }
    | { type: 'SET_SELECTED_DELIVERY_OPTION', payload: string | null }
    | { type: 'SET_SELECTED_PAYMENT_OPTION', payload: string | null }
    | { type: 'SET_DELIVERY_OPTION', payload: DeliveryOptionType | null }
    | { type: 'SET_ADDRESS', payload: AddressType }


// Initial state
const initialState: UseCheckoutStateType = {
    showFullOrderSummary: false,
    showLoginSection: false,
    editingAddressMode: false,
    selectedDeliveryOption: null,
    selectedPaymentOption: null,
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
        estado: '',
        regiao: '',
    },
};

// Reducer function
function reducer(state: UseCheckoutStateType, action: ActionType): UseCheckoutStateType {
    switch (action.type) {
    case 'SET_SHOW_LOGIN_SECTION':
        return { ...state, showLoginSection: action.payload };
    case 'SET_EDITING_ADDRESS_MODE':
        return { ...state, editingAddressMode: action.payload };
    case 'SET_SHOW_FULL_ORDER_SUMMARY':
        return { ...state, showFullOrderSummary: action.payload };
    case 'SET_SELECTED_DELIVERY_OPTION':
        return { ...state, selectedDeliveryOption: action.payload };
    case 'SET_SELECTED_PAYMENT_OPTION':
        return { ...state, selectedPaymentOption: action.payload };
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
    const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptionType[]>([]);
    
    const { userInfo } = useUserInfo();

    function fetchDeliveryOptions() {
        if(!state.address || !state.address.logradouro) return;
        if(state.address.logradouro.length === 0) return;
        const response = getShippingOptions(state.address.localidade, state.address.uf);
        setDeliveryOptions(response.map((option) => ({ deliveryTime: option.days, name: option.name, price: option.price })));
    }
  
    useEffect(() => {
        fetchDeliveryOptions();
    }, [state.address]);

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

    const handleShowLoginSection = useCallback((option: boolean) => {
        dispatch({ type: 'SET_SHOW_LOGIN_SECTION', payload: option });
    }, []);
    
    const handleAddressChange = useCallback((newAddress: AddressType) => {
        dispatch({ type: 'SET_ADDRESS', payload: newAddress });
    }, []);

    const handleEditingAddressMode = useCallback((mode: boolean) => {
        dispatch({ type: 'SET_EDITING_ADDRESS_MODE', payload: mode });
    }, []);

    const handleSelectedDeliveryOption = useCallback((option: string | null) => {
        dispatch({ type: 'SET_SELECTED_DELIVERY_OPTION', payload: option });
    }, []);

    const handleSelectedPaymentOption = useCallback((option: string | null) => {
        dispatch({ type: 'SET_SELECTED_PAYMENT_OPTION', payload: option });
    }, []);

    const handleShowFullOrderSummary = useCallback((option: boolean) => {
        dispatch({ type: 'SET_SHOW_FULL_ORDER_SUMMARY', payload: option });
    }, []);


    return {
        state,
        handleAddressChange,
        handleEditingAddressMode,
        handleSelectedDeliveryOption,
        handleSelectedPaymentOption,
        handleShowFullOrderSummary,
        deliveryOptions,
        fetchDeliveryOptions,
        handleShowLoginSection,
    };
}
