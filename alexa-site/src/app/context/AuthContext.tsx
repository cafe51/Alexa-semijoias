// app/context/AuthContext.tsx
'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { auth } from '../firebase/config';
import { User } from 'firebase/auth';

interface AuthState {
    user: User | null;
    authIsReady: boolean;
}

interface AuthAction {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_IS_READY';
    payload: User | null;
}

export const AuthContext = createContext<AuthState & { dispatch: React.Dispatch<AuthAction> }| undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    
    switch (action.type) {
    case 'LOGIN':
        return { ...state, user: action.payload };
    case 'LOGOUT':
        return { ...state, user: null };
    case 'AUTH_IS_READY':
        return { user: action.payload, authIsReady: true };
    default:
        return state;
    }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: null,
        authIsReady: false,
    });



    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            dispatch({ type: 'AUTH_IS_READY', payload: user ? { ...user } : null });
            unsub();
        });
    }, []);

    return (
        <AuthContext.Provider value={ { ...state, dispatch } }>
            { children }
        </AuthContext.Provider>
    );
};
