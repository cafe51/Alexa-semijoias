// app/hooks/useCollections.ts

import { useEffect, useRef, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, where  } from 'firebase/firestore';

type FilterOption = { field: string, operator: '==', value: string | number } ;



export const useCollection = (collectionName: string, _filterOptions:  FilterOption[] | null) => {
    const [ documents, setDocuments ] = useState<null | any[]>(null);

    const filterOptions = useRef(_filterOptions).current;



    useEffect(() => {
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if(filterOptions) {
            ref = query(ref, ...filterOptions.map(option => where(option.field, option.operator, option.value)));
        }
    
        const unsub = onSnapshot(ref, (snapshot) => {

            const results = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    exist: doc.exists(),
                    ...doc.data(),
                };
            });

            results ? setDocuments(results) : '';

            console.log('useCollection linha 37', results);
        });
        return () => unsub();

    }, [collectionName, filterOptions]);

    const addDocument = async(dataObj: any) => await addDoc(collection(projectFirestoreDataBase, collectionName), dataObj);

  
    const deleteDocument = async(id: string) => await deleteDoc(doc(projectFirestoreDataBase, collectionName, id));

    const getDocumentById = async(id: string) => {
        const docRef = doc(projectFirestoreDataBase, collectionName, id); // Referência ao documento com ID '12345'
        const docSnap = await getDoc(docRef); // Obtém o documento
        return {
            id: docSnap.id,
            exist: docSnap.exists(),
            ...docSnap.data(),
        };
        

    }; 



    return { documents, addDocument, deleteDocument, getDocumentById };


};