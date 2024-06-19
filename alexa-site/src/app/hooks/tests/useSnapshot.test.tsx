/* eslint-disable @typescript-eslint/no-unused-vars */
// app/hooks/useSnapshot.test.ts

import { renderHook, waitFor } from '@testing-library/react';
import { useSnapshot } from '../useSnapshot';
import { onSnapshot } from 'firebase/firestore';

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

    it('should initialize with no documents', () => {
        const unsubscribe = jest.fn();
        (onSnapshot as jest.Mock).mockImplementationOnce((query, callback) => {
            // Não chama o callback imediatamente para testar o estado inicial
            return unsubscribe;
        });

        const { result } = renderHook(() => useSnapshot('testCollection', null));
        expect(result.current.documents).toBe(null);
    });

    it('should get all documents with filters', async() => {
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
    });
});
