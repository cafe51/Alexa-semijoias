// app/hooks/useCheckoutState.ts
import { useEffect, useReducer, useCallback } from 'react';
import { AddressType, DeliveryOptionType, UseCheckoutStateType } from '../utils/types';
import { useUserInfo } from '../hooks/useUserInfo';


// const SET_SHOW_FULL_ORDER_SUMMARY = 'SET_SHOW_FULL_ORDER_SUMMARY'
// const SET_SHOW_REGISTER_SECTION = 'SET_SHOW_REGISTER_SECTION'
// const SET_EDITING_ADDRESS_MODE = 'SET_EDITING_ADDRESS_MODE'
// const SET_SELECTED_DELIVERY_OPTION = 'SET_SELECTED_DELIVERY_OPTION'
// const SET_SELECTED_PAYMENT_OPTION = 'SET_SELECTED_PAYMENT_OPTION'
// const SET_DELIVERY_OPTION = 'SET_DELIVERY_OPTION'
// const SET_ADDRESS = 'SET_ADDRESS'

// Define action types
type ActionType = 
    | { type: 'SET_SHOW_FULL_ORDER_SUMMARY', payload: boolean }
    | { type: 'SET_SHOW_REGISTER_SECTION', payload: boolean }
    | { type: 'SET_EDITING_ADDRESS_MODE', payload: boolean }
    | { type: 'SET_SELECTED_DELIVERY_OPTION', payload: string | null }
    | { type: 'SET_SELECTED_PAYMENT_OPTION', payload: string | null }
    | { type: 'SET_DELIVERY_OPTION', payload: DeliveryOptionType | null }
    | { type: 'SET_ADDRESS', payload: AddressType }


// Initial state
const initialState: UseCheckoutStateType = {
    showFullOrderSummary: false,
    showRegisterSection: false,
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
    },
};

// Reducer function
function reducer(state: UseCheckoutStateType, action: ActionType): UseCheckoutStateType {
    switch (action.type) {
    case 'SET_SHOW_REGISTER_SECTION':
        return { ...state, showRegisterSection: action.payload };
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

    const handleShowRegisterSection = useCallback((option: boolean) => {
        dispatch({ type: 'SET_SHOW_REGISTER_SECTION', payload: option });
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

        handleShowRegisterSection,
    };
}
