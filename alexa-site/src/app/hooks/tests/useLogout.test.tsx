// app/hooks/useLogout.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useLogout } from '../useLogout';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../../context/AuthContext';
import React from 'react';

jest.mock('firebase/auth', () => ({
    signOut: jest.fn(),
    getAuth: () => ({
        onAuthStateChanged: jest.fn(),
    }),
}));

describe('useLogout Hook', () => {
    let mockDispatch: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockDispatch = jest.fn();
    });

    it('realiza logout com sucesso', async() => {
        (signOut as jest.Mock).mockResolvedValue(undefined);
        
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { user: undefined, authIsReady: false, dispatch: mockDispatch } }>
                { children }
            </AuthContext.Provider>
        );
        
        const { result } = renderHook(() => useLogout(), { wrapper });

        await act(async() => {
            result.current.logout();
        });

        expect(signOut).toHaveBeenCalledWith(expect.any(Object)); // auth object
        expect(mockDispatch).toHaveBeenCalledWith({ type: 'LOGOUT' });
    });

    it('lida com erros de logout', async() => {
        const errorMessage = 'Erro de logout simulado';
        (signOut as jest.Mock).mockRejectedValue(new Error(errorMessage));

        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <AuthContext.Provider value={ { user: undefined, authIsReady: false, dispatch: mockDispatch } }>
                { children }
            </AuthContext.Provider>
        );

        const { result } = renderHook(() => useLogout(), { wrapper });

        await act(async() => {
            result.current.logout();
        });

        expect(signOut).toHaveBeenCalledWith(expect.any(Object)); // auth object
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith(errorMessage);

        consoleSpy.mockRestore();
    });
});
