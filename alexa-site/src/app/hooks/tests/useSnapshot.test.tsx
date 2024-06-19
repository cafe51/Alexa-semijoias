// app/hooks/useSnapshot.test.ts
/* eslint-disable @typescript-eslint/no-unused-vars */

import { renderHook, waitFor } from '@testing-library/react';
import { useSnapshot } from '../useSnapshot';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';

jest.mock('../../firebase/config', () => ({
    projectFirestoreDataBase: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    addDoc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getDocs: jest.fn(),
    query: jest.fn(),
    where: jest.fn(),
    onSnapshot: jest.fn(),
    getFirestore: jest.fn(),
}));

jest.mock('firebase/app', () => ({
    getApps: jest.fn(() => []),
    initializeApp: jest.fn(() => ({})),
}));

jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
}));

describe('useSnapshot', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('inicialmente não deve retornar nenhum documento e o estado inicial deve ser null', () => {
        const unsubscribe = jest.fn();
        (onSnapshot as jest.Mock).mockImplementationOnce((query, callback) => {
            // Não chama o callback imediatamente para testar o estado inicial
            return unsubscribe;
        });

        const { result } = renderHook(() => useSnapshot('testCollection', null));
        expect(result.current.documents).toBe(null);
    });

    it('retorna todos os documentos com o filtro', async() => {
        const unsubscribe = jest.fn();
        (onSnapshot as jest.Mock).mockImplementationOnce((query, callback) => {
            callback({
                docs: [
                    {
                        id: '1',
                        exists: jest.fn(() => true),
                        data: jest.fn(() => ({ test: 'value' })),
                    },
                ],
            });
            return unsubscribe;
        });

        const { result } = renderHook(() => useSnapshot('testCollection', [{ field: 'test', operator: '==', value: 'value' }]));
        
        // Verifica o estado atualizado
        await waitFor(() => {
            expect(result.current.documents).toEqual([{ id: '1', exist: true, test: 'value' }]);
        });

        expect(collection).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection');
        expect(where).toHaveBeenCalledWith('test', '==', 'value');
        expect(query).toHaveBeenCalledWith(undefined, undefined);
        expect(onSnapshot).toHaveBeenCalledWith(undefined, expect.any(Function));
    });
});
