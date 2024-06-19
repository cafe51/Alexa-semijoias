// app/hooks/useAuthContext.test.test.ts
import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAuthContext } from '../useAuthContext';
import { AuthContext, AuthState } from '../../context/AuthContext';
import { User } from 'firebase/auth';

jest.mock('../../context/AuthContext', () => {
    return {
        AuthContext: React.createContext(null),
    };
});

const mockUser: User = {
    uid: 'testId',
    email: 'test@example.com',
    emailVerified: false,
    displayName: 'Test User',
    isAnonymous: false,
    photoURL: null,
    providerData: [],
    phoneNumber: null,
    metadata: {
        creationTime: '2021-01-01T00:00:00Z',
        lastSignInTime: '2021-01-01T00:00:00Z',
    },
    refreshToken: '',
    tenantId: null,
    providerId: 'testProviderId',
    delete: jest.fn(),
    getIdToken: jest.fn(),
    getIdTokenResult: jest.fn(),
    reload: jest.fn(),
    toJSON: jest.fn(),
};

const initialState = {
    user: mockUser,
    authIsReady: true,
};

const mockDispatch = jest.fn();

const renderHookWithException = (hook: () => void) => {
    try {
        renderHook(hook);
    } catch (error) {
        return error;
    }
    return null;
};

describe('useAuthContext Hook', () => {
    it('retorna o contexto de autenticação', () => {
        const mockState: AuthState = { user: mockUser, authIsReady: true };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { ...initialState, dispatch: mockDispatch } }>
                { children }
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useAuthContext(), { wrapper });

        expect(result.current).toEqual({
            ...mockState, 
            dispatch: mockDispatch,
        });
    });

    it('lança um erro quando o hook é usado fora do AuthContextProvider', () => {
        // Suprime logs de erro temporariamente
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Executa o hook fora do contexto do provider para verificar se lança erro
        const error = renderHookWithException(() => useAuthContext());

        // Restaura o comportamento padrão do console.error
        spy.mockRestore();

        // Verifica se o erro correto foi lançado
        expect(error).toEqual(Error('useAuthContext must be inside an AuthContextProvider'));
    });

});