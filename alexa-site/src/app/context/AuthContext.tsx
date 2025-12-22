// app/context/AuthContext.tsx
'use client';

import { createContext, useReducer, useEffect, ReactNode } from 'react';
import { auth, projectFirestoreDataBase } from '../firebase/config';
import { User, getIdTokenResult } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export interface AuthState {
    user: User | undefined;
    authIsReady: boolean;
    isAdmin: boolean;
    isLoading: boolean;
}

interface AuthAction {
    type: 'LOGIN' | 'LOGOUT' | 'AUTH_IS_READY' | 'SET_ADMIN' | 'SET_LOADING';
    payload?: User | undefined | boolean;
}

export const AuthContext = createContext<AuthState & { dispatch: React.Dispatch<AuthAction> } | undefined>(undefined);

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload as User };
        case 'LOGOUT':
            return { ...state, user: undefined, isAdmin: false };
        case 'AUTH_IS_READY':
            return { ...state, user: action.payload as User | undefined, authIsReady: true };
        case 'SET_ADMIN':
            return { ...state, isAdmin: action.payload as boolean };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload as boolean };
        default:
            return state;
    }
};

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: undefined,
        authIsReady: false,
        isAdmin: false,
        isLoading: true,
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const [userDoc, idTokenResult] = await Promise.all([
                        getDoc(doc(projectFirestoreDataBase, 'usuarios', user.uid)),
                        getIdTokenResult(user, true),
                    ]);

                    const userData = userDoc.data();

                    // Verifica se o usuário tem o CPF cadastrado
                    if (!userData || !userData.cpf) {
                        dispatch({ type: 'AUTH_IS_READY', payload: undefined });
                        dispatch({ type: 'SET_ADMIN', payload: false });
                        return;
                    }

                    const isAdminInFirestore = userData?.admin === true;
                    const hasAdminClaim = idTokenResult.claims.admin === true;
                    const isAdmin = isAdminInFirestore && hasAdminClaim;

                    dispatch({ type: 'AUTH_IS_READY', payload: { ...user } });
                    dispatch({ type: 'SET_ADMIN', payload: isAdmin });

                } catch (error) {
                    console.error('Erro ao verificar status de admin:', error);
                    dispatch({ type: 'SET_ADMIN', payload: false });
                }
            } else {
                dispatch({ type: 'AUTH_IS_READY', payload: undefined });
                dispatch({ type: 'SET_ADMIN', payload: false });
            }
            dispatch({ type: 'SET_LOADING', payload: false });
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};
