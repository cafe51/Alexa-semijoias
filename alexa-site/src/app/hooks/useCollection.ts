// app/hooks/useCollections.ts

import { useEffect, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot  } from 'firebase/firestore';

export const useCollection = (collectionName: string) => {
    const [ documents, setDocuments ] = useState<null | any[]>(null);

    useEffect(() => {
        const ref = collection(projectFirestoreDataBase, collectionName);
    
        const unsub = onSnapshot(ref, (snapshot) => {

            const results = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    exist: doc.exists(),
                    ...doc.data(),
                };
            });

            results ? setDocuments(results) : '';
        });
        return () => unsub();

    }, [collectionName]);

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