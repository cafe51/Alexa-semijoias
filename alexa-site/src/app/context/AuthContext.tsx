// app/context/AuthContext.tsx
'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { auth } from '../firebase/config';
import { User } from 'firebase/auth';

export interface AuthState {
    user: User | undefined;
    authIsReady: boolean;
}

interface AuthAction {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_IS_READY';
    payload?: User | undefined;
}

export const AuthContext = createContext<AuthState & { dispatch: React.Dispatch<AuthAction> }| undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    
    switch (action.type) {
    case 'LOGIN':
        return { ...state, user: action.payload };
    case 'LOGOUT':
        return { ...state, user: undefined };
    case 'AUTH_IS_READY':
        return { user: action.payload, authIsReady: true };
    default:
        return state;
    }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, { 
        user: undefined,
        authIsReady: false,
    });



    useEffect(() => {
        const unsub = auth.onAuthStateChanged(user => {
            dispatch({ type: 'AUTH_IS_READY', payload: user ? { ...user } : undefined });
            unsub();
        });
    }, []);

    return (
        <AuthContext.Provider value={ { ...state, dispatch } }>
            { children }
        </AuthContext.Provider>
    );
};
