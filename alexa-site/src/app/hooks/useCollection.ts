// app/hooks/useCollection.ts

import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, addDoc, collection, doc, getDoc, query, where, deleteDoc, updateDoc, getDocs, WithFieldValue, setDoc  } from 'firebase/firestore';
import { FilterOption } from '../utils/types';

export const useCollection = <T>(collectionName: string) => {
    const addDocument = async(dataObj: T & WithFieldValue<DocumentData>, id?: string) => {
        try {
            if (id) {
                // Define o ID específico
                const docRef = doc(projectFirestoreDataBase, collectionName, id);
                await setDoc(docRef, dataObj);
            } else {
                // Gera um ID automaticamente
                await addDoc(collection(projectFirestoreDataBase, collectionName), dataObj);
            }
        } catch(error) {
            console.error(error);
        }
    };

  
    const deleteDocument = async(id: string) => await deleteDoc(doc(projectFirestoreDataBase, collectionName, id));

    const updateDocumentField = async(id: string, field: string, value: string | number | string[] | number[] | object) => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id);
        console.log('chamou update', id, field, value, docRef);
        await updateDoc(docRef, { [field]: value });
    };


    const getDocumentById = async(id: string): Promise<T & WithFieldValue<DocumentData>> => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id); // Referência ao documento com ID '12345'
        const docSnap = await getDoc(docRef); // Obtém o documento

        return {
            id: docSnap.id,
            exist: docSnap.exists(),
            ...(docSnap.data() as T),
        };
    };

    const getAllDocuments = async(filterOptions?: FilterOption[] | null): Promise<(T & WithFieldValue<DocumentData>)[]> => {
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if(filterOptions) {
            ref = query(ref, ...filterOptions.map(option => where(option.field, option.operator, option.value)));
        }
        const collectionSnapshot = await getDocs(ref);
        const collectionSnapshotDocs = collectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists(),
            ...doc.data() as T,
        }));
        console.log('COLLECTIONSNAPSHOT', collectionSnapshotDocs);

        return collectionSnapshotDocs;

    }; 
    
    
    return { addDocument, deleteDocument, getDocumentById, updateDocumentField, getAllDocuments };


};