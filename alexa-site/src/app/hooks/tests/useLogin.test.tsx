// app/hooks/tests/useLogin.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useLogin } from '../useLogin';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import React from 'react';
import { UserInfoProvider } from '@/app/context/UserInfoContext';
import { useCollection } from '../useCollection';

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    getAuth: () => ({
        onAuthStateChanged: jest.fn(),
    }),
}));

jest.mock('../useCollection', () => ({
    useCollection: jest.fn(),
}));

const mockUser = {
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

const mockUserCredential = {
    user: mockUser,
};

describe('useLogin Hook', () => {
    let mockPush: jest.Mock;
    let mockGetAllDocuments: jest.Mock;
    let mockDeleteCartItemDocument: jest.Mock;
    let mockAddDocument: jest.Mock;



    beforeEach(() => {
        jest.clearAllMocks();
        mockPush = jest.fn();
        mockGetAllDocuments = jest.fn().mockResolvedValue([]); // Simule um carrinho vazio no Firebase
        mockDeleteCartItemDocument = jest.fn().mockResolvedValue(null);
        mockAddDocument = jest.fn().mockResolvedValue(null);
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCollection as jest.Mock).mockReturnValue({
            deleteDocument: mockDeleteCartItemDocument,
            getAllDocuments: mockGetAllDocuments,
            addDocument: mockAddDocument,
        });

    });

    it('realiza login com sucesso', async() => {
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { user: undefined, authIsReady: false, dispatch: jest.fn() } }>
                <UserInfoProvider>{ children }</UserInfoProvider>
            </AuthContext.Provider>
        );
        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async() => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
            expect.any(Object), // auth object
            'test@example.com',
            'password123',
        );

        expect(result.current.error).toBeNull();
        expect(mockPush).toHaveBeenCalledWith('/');
    });

    it('lida com erros de login', async() => {
        const errorMessage = 'Erro de login simulado';
        (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { user: undefined, authIsReady: false, dispatch: jest.fn() } }>
                <UserInfoProvider>{ children }</UserInfoProvider>
            </AuthContext.Provider>
        );
        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async() => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(result.current.error).toBe(errorMessage);
    });

    it('verifica se o dispatch é chamado corretamente após login bem-sucedido', async() => {
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
        const mockDispatch = jest.fn();

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { user: undefined, authIsReady: false, dispatch: mockDispatch } }>
                <UserInfoProvider>{ children }</UserInfoProvider>
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useLogin(), { wrapper });

        await act(async() => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(mockDispatch).toHaveBeenCalledWith({
            type: 'LOGIN',
            payload: mockUser,
        });
    });

    it('verifica o estado de erro antes e depois de uma tentativa de login mal-sucedida', async() => {
        const errorMessage = 'Erro de login simulado';
        (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { user: undefined, authIsReady: false, dispatch: jest.fn() } }>
                <UserInfoProvider>{ children }</UserInfoProvider>
            </AuthContext.Provider>
        );
        const { result } = renderHook(() => useLogin(), { wrapper });

        expect(result.current.error).toBeNull(); // Estado de erro inicial

        await act(async() => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(result.current.error).toBe(errorMessage); // Estado de erro após tentativa falha
    });
});
