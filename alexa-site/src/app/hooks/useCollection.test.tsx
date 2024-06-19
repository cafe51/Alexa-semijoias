// app/hooks/useCollection.test.ts

import { renderHook, act, waitFor } from '@testing-library/react';
import { useCollection } from './useCollection';
import { addDoc, deleteDoc, updateDoc, getDoc, getDocs, onSnapshot, collection, doc, query, where } from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { projectFirestoreDataBase } from '../firebase/config';

jest.mock('../firebase/config', () => ({
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

describe('useCollection', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // it('should initialize with no documents', () => {
    //     const unsubscribe = jest.fn();
    //     (onSnapshot as jest.Mock).mockImplementationOnce((query, callback) => {
    //         // Não chama o callback imediatamente para testar o estado inicial
    //         return unsubscribe;
    //     });

    //     const { result } = renderHook(() => useCollection('testCollection', null));
    //     expect(result.current.documents).toBe(null);
    // });

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

        const { result } = renderHook(() => useCollection('testCollection', [{ field: 'test', operator: '==', value: 'value' }]));
        
        // Verifica o estado atualizado
        await waitFor(() => {
            expect(result.current.documents).toEqual([{ id: '1', exist: true, test: 'value' }]);
        });
    });

    // it('should get all documents with filters', async() => {
    //     const mockDocs = [
    //         { id: 'doc1', exists: jest.fn(() => true), data: jest.fn(() => ({ field: 'value1' })) },
    //         { id: 'doc2', exists: jest.fn(() => true), data: jest.fn(() => ({ field: 'value2' })) },
    //     ];

    //     (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

    //     const { result } = renderHook(() => useCollection('testCollection', null));

    //     let documents;
    //     await act(async() => {
    //         documents = await result.current.getAllDocuments([{ field: 'field', operator: '==', value: 'value' }]);
    //     });

    //     expect(getDocs).toHaveBeenCalled();
    //     expect(documents).toEqual([
    //         { id: 'doc1', exist: true, field: 'value1' },
    //         { id: 'doc2', exist: true, field: 'value2' },
    //     ]);
    // });

    // it('should get a document by ID', async() => {
    //     const mockDoc = { id: 'testId', exists: jest.fn(() => true), data: jest.fn(() => ({ field: 'value' })) };
    //     (getDoc as jest.Mock).mockResolvedValue(mockDoc);

    //     const { result } = renderHook(() => useCollection('testCollection', null));

    //     let document;
    //     await act(async() => {
    //         document = await result.current.getDocumentById('testId');
    //     });

    //     expect(getDoc).toHaveBeenCalled();
    //     expect(document).toEqual({ id: 'testId', exist: true, field: 'value' });
    // });

    // it('should add a document', async() => {
    //     const { result } = renderHook(() => useCollection('testCollection', null));

    //     await act(async() => {
    //         await result.current.addDocument({ field: 'value' });
    //     });

    //     expect(collection).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection');
    //     expect(addDoc).toHaveBeenCalledWith(undefined, { field: 'value' });
    // });

    // it('should delete a document', async() => {
    //     const { result } = renderHook(() => useCollection('testCollection', null));

    //     await act(async() => {
    //         await result.current.deleteDocument('testId');
    //     });

    //     expect(deleteDoc).toHaveBeenCalledWith(undefined);
    //     expect(doc).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection', 'testId');
    // });

    // it('should update a document field', async() => {
    //     const { result } = renderHook(() => useCollection('testCollection', null));

    //     await act(async() => {
    //         await result.current.updateDocumentField('testId', 'field', 'newValue');
    //     });

    //     expect(doc).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection', 'testId');
    //     expect(updateDoc).toHaveBeenCalledWith(undefined, { field: 'newValue' });
    // });

});
