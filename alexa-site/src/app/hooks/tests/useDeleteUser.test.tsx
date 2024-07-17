// app/hooks/tests/useDeleteUser.test.tsx

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
    let mockDeleteUserDocument: jest.Mock;
    let mockDeleteCartItemDocument: jest.Mock;
    let mockGetAllDocuments: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPush = jest.fn();
        mockDeleteUserDocument = jest.fn().mockResolvedValue(undefined);
        mockDeleteCartItemDocument = jest.fn().mockResolvedValue(undefined);
        mockGetAllDocuments = jest.fn().mockResolvedValue([{ id: 'cartItem1' }, { id: 'cartItem2' }]);

        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        (useCollection as jest.Mock).mockImplementation((collectionName: string) => {
            if (collectionName === 'usuarios') {
                return { deleteDocument: mockDeleteUserDocument };
            } else if (collectionName === 'carrinhos') {
                return { deleteDocument: mockDeleteCartItemDocument, getAllDocuments: mockGetAllDocuments };
            }
            return { deleteDocument: jest.fn(), getAllDocuments: jest.fn() };
        });
        (useUserInfo as jest.Mock).mockReturnValue({ userInfo: { id: 'userId', userId: 'testId' } });
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
        expect(mockGetAllDocuments).toHaveBeenCalledWith([{ field: 'userId', operator: '==', value: 'testId' }]);
        expect(mockDeleteCartItemDocument).toHaveBeenCalledWith('cartItem1');
        expect(mockDeleteCartItemDocument).toHaveBeenCalledWith('cartItem2');
        expect(mockDeleteUserDocument).toHaveBeenCalledWith('userId');
        expect(deleteUser).toHaveBeenCalledWith(expect.any(Object)); // currentUser
        // expect(mockPush).toHaveBeenCalledWith('/');
        expect(result.current.error).toBe('ERADO');
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
        expect(mockGetAllDocuments).toHaveBeenCalledWith([{ field: 'userId', operator: '==', value: 'testId' }]);
        expect(mockDeleteCartItemDocument).toHaveBeenCalledWith('cartItem1');
        expect(mockDeleteCartItemDocument).toHaveBeenCalledWith('cartItem2');
        expect(mockDeleteUserDocument).toHaveBeenCalledWith('userId');
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
        expect(mockGetAllDocuments).not.toHaveBeenCalled();
        expect(mockDeleteCartItemDocument).not.toHaveBeenCalled();
        expect(mockDeleteUserDocument).not.toHaveBeenCalled();
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
        expect(mockGetAllDocuments).not.toHaveBeenCalled();
        expect(mockDeleteCartItemDocument).not.toHaveBeenCalled();
        expect(mockDeleteUserDocument).not.toHaveBeenCalled();
        expect(deleteUser).not.toHaveBeenCalled();
        expect(result.current.error).toBe(errorMessage);
    });
});
