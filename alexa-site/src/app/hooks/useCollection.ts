// app/hooks/useCollection.ts

import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, addDoc, collection, doc, getDoc, query, where, deleteDoc, updateDoc, getDocs, setDoc, orderBy, limit  } from 'firebase/firestore';
import { FilterOption, FireBaseDocument } from '../utils/types';
import { useCallback } from 'react';

type OrderByOption = {
    field: string;
    direction: 'asc' | 'desc';
} | null;

export const useCollection = <T>(collectionName: string) => {
    const addDocument = useCallback(async(dataObj: T & { id?: string }, id?: string) => {
        if (id) {
            // Define o ID específico
            console.log('projectFirestoreDataBase', projectFirestoreDataBase);
            console.log('collectionName', collectionName);
            console.log('dataObj', dataObj);
            console.log('id', id);
            const docRef = doc(projectFirestoreDataBase, collectionName, id);
            await setDoc(docRef, dataObj);
        } else {
            // Gera um ID automaticamente
            console.log('projectFirestoreDataBase', projectFirestoreDataBase);
            console.log('collectionName', collectionName);
            console.log('dataObj', dataObj);
            await addDoc(collection(projectFirestoreDataBase, collectionName), dataObj);
        }
    }, [collectionName]);
  
    const deleteDocument = useCallback(async(id: string) => await deleteDoc(doc(projectFirestoreDataBase, collectionName, id)), [collectionName]);

    const updateDocumentField = useCallback(async(id: string, field: string, value: string | number | string[] | number[] | object) => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id);
        console.log('chamou update', id, field, value, docRef);
        await updateDoc(docRef, { [field]: value });
    }, [collectionName]);

    const getDocumentById = useCallback(async(id: string): Promise<T & FireBaseDocument> => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id); // Referência ao documento com ID '12345'
        const docSnap = await getDoc(docRef); // Obtém o documento

        return {
            id: docSnap.id,
            exist: docSnap.exists(),
            ...(docSnap.data() as T),
        };
    }, [collectionName]);

    const getAllDocuments = useCallback(async(
        filterOptions?: FilterOption[] | null,
        itemsPerPage?: number,
        orderByOption?: OrderByOption,
    ): Promise<(T & FireBaseDocument)[]> => {
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if (filterOptions) {
            const whereClauses = filterOptions.filter(option => option.operator && option.value);
            const orderClauses = filterOptions.filter(option => option.order);

            if (whereClauses.length > 0) {
                ref = query(ref, ...whereClauses.map(option => where(option.field, option.operator!, option.value!)));
            }

            if (orderClauses.length > 0) {
                orderClauses.forEach(option => {
                    ref = query(ref, orderBy(option.field, option.order!));
                });
            }
        }

        // Adiciona ordenação personalizada se especificada
        if (orderByOption) {
            ref = query(ref, orderBy(orderByOption.field, orderByOption.direction));
        }

        // Adiciona limite de documentos se itemsPerPage for especificado
        if (itemsPerPage) {
            ref = query(ref, limit(itemsPerPage));
        }

        const collectionSnapshot = await getDocs(ref);
        const collectionSnapshotDocs = collectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists(),
            ...doc.data() as T,
        }));

        return collectionSnapshotDocs;
    }, [collectionName]);
    
    return { addDocument, deleteDocument, getDocumentById, updateDocumentField, getAllDocuments };
};
