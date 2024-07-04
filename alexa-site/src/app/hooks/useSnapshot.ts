// app/hooks/useSnapshot.ts
import { useEffect, useRef, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, collection,query, where, onSnapshot } from 'firebase/firestore';
import { FilterOption } from '../utils/types';

export const useSnapshot = <T>(collectionName: string, filterOptions:  FilterOption[] | null) => {
    const [ documents, setDocuments ] = useState<(T & DocumentData)[] | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);


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
                    ...doc.data() as T,
                };
            });

            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                results ? setDocuments(results) : '';
            }, 150); // Ajuste o tempo conforme necessário

            

        });
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            unsub();
        };

    }, [collectionName, filterOptions]);

    return { documents };

};