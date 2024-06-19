// app/hooks/useCollection.test.ts

import { renderHook, act } from '@testing-library/react';
import { useCollection } from '../useCollection';
import { addDoc, deleteDoc, updateDoc, getDoc, getDocs, collection, doc, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../../firebase/config';

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

    it('should get all documents with filters', async() => {
        const mockDocs = [
            { id: 'doc1', exists: jest.fn(() => true), data: jest.fn(() => ({ field: 'value1' })) },
            { id: 'doc2', exists: jest.fn(() => true), data: jest.fn(() => ({ field: 'value2' })) },
        ];

        (getDocs as jest.Mock).mockResolvedValue({ docs: mockDocs });

        const { result } = renderHook(() => useCollection('testCollection'));

        let documents;
        await act(async() => {
            documents = await result.current.getAllDocuments([{ field: 'field', operator: '==', value: 'value' }]);
        });

        expect(where).toHaveBeenCalled();
        expect(collection).toHaveBeenCalled();
        expect(query).toHaveBeenCalled();
        expect(getDocs).toHaveBeenCalled();

        expect(where).toHaveBeenCalledWith('field', '==', 'value');
        expect(collection).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection');
        expect(query).toHaveBeenCalledWith(undefined, undefined);
        expect(getDocs).toHaveBeenCalledWith(undefined);


        expect(documents).toEqual([
            { id: 'doc1', exist: true, field: 'value1' },
            { id: 'doc2', exist: true, field: 'value2' },
        ]);
    });

    it('should get a document by ID', async() => {
        const mockDoc = { id: 'testId', exists: jest.fn(() => true), data: jest.fn(() => ({ field: 'value' })) };
        (getDoc as jest.Mock).mockResolvedValue(mockDoc);

        const { result } = renderHook(() => useCollection('testCollection'));

        let document;
        await act(async() => {
            document = await result.current.getDocumentById('testId');
        });

        expect(doc).toHaveBeenCalled();
        expect(getDoc).toHaveBeenCalled();


        expect(doc).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection', 'testId');
        expect(getDoc).toHaveBeenCalledWith(undefined);

        expect(document).toEqual({ id: 'testId', exist: true, field: 'value' });
    });

    it('should add a document', async() => {
        const { result } = renderHook(() => useCollection('testCollection'));

        await act(async() => {
            await result.current.addDocument({ field: 'value' });
        });

        expect(collection).toHaveBeenCalled();
        expect(addDoc).toHaveBeenCalled();

        expect(collection).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection');
        expect(addDoc).toHaveBeenCalledWith(undefined, { field: 'value' });
    });

    it('should delete a document', async() => {
        const { result } = renderHook(() => useCollection('testCollection'));

        await act(async() => {
            await result.current.deleteDocument('testId');
        });

        expect(doc).toHaveBeenCalled();
        expect(deleteDoc).toHaveBeenCalled();

        expect(doc).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection', 'testId');
        expect(deleteDoc).toHaveBeenCalledWith(undefined);
    });

    it('should update a document field', async() => {
        const { result } = renderHook(() => useCollection('testCollection'));

        await act(async() => {
            await result.current.updateDocumentField('testId', 'field', 'newValue');
        });

        expect(doc).toHaveBeenCalled();
        expect(updateDoc).toHaveBeenCalled();

        expect(doc).toHaveBeenCalledWith(projectFirestoreDataBase, 'testCollection', 'testId');
        expect(updateDoc).toHaveBeenCalledWith(undefined, { field: 'newValue' });
    });

});
