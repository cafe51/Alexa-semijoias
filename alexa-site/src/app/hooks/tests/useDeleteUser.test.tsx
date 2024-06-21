//app/hooks/tests/useDeleteUser.test.tsx

import { renderHook, act } from '@testing-library/react';
import { useDeleteUser } from '../useDeleteUser';
import { signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCollection } from '../useCollection';
import { useUserInfo } from '../useUserInfo';

jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    deleteUser: jest.fn(),
    getAuth: jest.fn(() => ({
        onAuthStateChanged: jest.fn(),
        get currentUser() {
            return globalThis.__mockCurrentUser;
        },
    })),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../useCollection', () => ({
    useCollection: jest.fn(),
}));

jest.mock('../useUserInfo', () => ({
    useUserInfo: jest.fn(),
}));

describe('useDeleteUser Hook', () => {
    let mockPush: jest.Mock;
    let mockDeleteDocument: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPush = jest.fn();
        mockDeleteDocument = jest.fn().mockResolvedValueOnce(undefined);

        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCollection as jest.Mock).mockReturnValue({ deleteDocument: mockDeleteDocument });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { id: 'userId' } });
    });

    it('realiza exclusão de usuário com sucesso', async() => {
        globalThis.__mockCurrentUser = { uid: 'testId' };
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});
        (deleteUser as jest.Mock).mockResolvedValueOnce(undefined);

        const { result } = renderHook(() => useDeleteUser());

        await act(async() => {
            await result.current.deleteUserAccount('test@example.com', 'password123');
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
        expect(mockDeleteDocument).toHaveBeenCalledWith('userId');
        expect(deleteUser).toHaveBeenCalledWith(expect.any(Object)); // currentUser
        // expect(mockPush).toHaveBeenCalledWith('/');
        expect(result.current.error).toBeNull();
    });

    it('lida com erro ao excluir usuário do Firebase', async() => {
        globalThis.__mockCurrentUser = { uid: 'testId' };
        const errorMessage = 'Erro ao excluir usuário';
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});
        (deleteUser as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useDeleteUser());

        await act(async() => {
            await result.current.deleteUserAccount('test@example.com', 'password123');
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
        expect(mockDeleteDocument).toHaveBeenCalledWith('userId');
        expect(deleteUser).toHaveBeenCalledWith(expect.any(Object)); // currentUser
        expect(result.current.error).toBe(errorMessage);
    });

    it('lida com erro ao fazer login', async() => {
        globalThis.__mockCurrentUser = { uid: 'testId' };
        const errorMessage = 'Erro de login simulado';
        (signInWithEmailAndPassword as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

        const { result } = renderHook(() => useDeleteUser());

        await act(async() => {
            await result.current.deleteUserAccount('test@example.com', 'password123');
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
        expect(mockDeleteDocument).not.toHaveBeenCalled();
        expect(deleteUser).not.toHaveBeenCalled();
        expect(result.current.error).toBe(errorMessage);
    });

    it('lida com caso onde o usuário não está autenticado', async() => {
        globalThis.__mockCurrentUser = null;
        const errorMessage = 'Nenhum usuário está autenticado.';
        (signInWithEmailAndPassword as jest.Mock).mockResolvedValueOnce({});
        const { result } = renderHook(() => useDeleteUser());

        await act(async() => {
            await result.current.deleteUserAccount('test@example.com', 'password123');
        });

        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.any(Object), 'test@example.com', 'password123');
        expect(mockDeleteDocument).toHaveBeenCalledWith('userId');
        expect(deleteUser).not.toHaveBeenCalled();
        expect(result.current.error).toBe(errorMessage);
    });
});