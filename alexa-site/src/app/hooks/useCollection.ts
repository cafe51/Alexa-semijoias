// app/hooks/useCollection.ts

import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, addDoc, collection, doc, getDoc, query, where, deleteDoc, updateDoc, getDocs, setDoc, orderBy  } from 'firebase/firestore';
import { FilterOption, FireBaseDocument } from '../utils/types';

export const useCollection = <T>(collectionName: string) => {
    const addDocument = async(dataObj: T & { id?: string }, id?: string) => {
        if (id) {
            console.log('CHEGOU AQUIIIII ID', id);
            // Define o ID específico
            const docRef = doc(projectFirestoreDataBase, collectionName, id);
            await setDoc(docRef, dataObj);
        } else {
            // Gera um ID automaticamente
            await addDoc(collection(projectFirestoreDataBase, collectionName), dataObj);
        }

    };

  
    const deleteDocument = async(id: string) => await deleteDoc(doc(projectFirestoreDataBase, collectionName, id));

    const updateDocumentField = async(id: string, field: string, value: string | number | string[] | number[] | object) => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id);
        console.log('chamou update', id, field, value, docRef);
        await updateDoc(docRef, { [field]: value });
    };


    const getDocumentById = async(id: string): Promise<T & FireBaseDocument> => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id); // Referência ao documento com ID '12345'
        const docSnap = await getDoc(docRef); // Obtém o documento

        return {
            id: docSnap.id,
            exist: docSnap.exists(),
            ...(docSnap.data() as T),
        };
    };

    const getAllDocuments = async(filterOptions?: FilterOption[] | null): Promise<(T & FireBaseDocument)[]> => {
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

        const collectionSnapshot = await getDocs(ref);
        const collectionSnapshotDocs = collectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists(),
            ...doc.data() as T,
        }));

        return collectionSnapshotDocs;
    };
    
    
    return { addDocument, deleteDocument, getDocumentById, updateDocumentField, getAllDocuments };


};