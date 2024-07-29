// app/hooks/useNewProductState.ts
import { useReducer, useCallback } from 'react';
import { UseNewProductStateType } from '../utils/types';

const SET_NAME: string & 'SET_NAME' = 'SET_NAME';
const SET_DESCRIPTION: string & 'SET_DESCRIPTION' = 'SET_DESCRIPTION';

// Define action types
type ActionType = 
    | { type: typeof SET_NAME, payload: string }
    | { type: typeof SET_DESCRIPTION, payload: string }

// Initial state
const initialState: UseNewProductStateType = {
    name: '',
    description: '',
};

// Reducer function
function reducer(state: UseNewProductStateType, action: ActionType): UseNewProductStateType {
    switch (action.type) {
    case SET_NAME:
        return { ...state, name: action.payload };
    case SET_DESCRIPTION:
        return { ...state, description: action.payload };
    default:
        return state;
    }
}

// Custom hook
export function useNewProductState() {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    const handleNameChange = useCallback((name: string) => {
        dispatch({ type: SET_NAME, payload: name });
    }, []);
    
    const handleDescriptionChange = useCallback((description: string) => {
        dispatch({ type: SET_DESCRIPTION, payload: description });
    }, []);

    return {
        state,
        handleNameChange,
        handleDescriptionChange,
    };
}
