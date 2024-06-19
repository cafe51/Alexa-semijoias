// app/hooks/useSnapshot.ts

import { useEffect, useRef, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, collection, onSnapshot, query, where  } from 'firebase/firestore';

type FilterOption = { field: string, operator: '==' | 'in', value: string | number | string[] | number[] } ;



export const useSnapshot = <T>(collectionName: string, _filterOptions:  FilterOption[] | null) => {
    const [ documents, setDocuments ] = useState<(T & DocumentData)[] | null>(null);

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
                    ...doc.data() as T,
                };
            });

            results ? setDocuments(results) : '';

        });
        return () => unsub();

    }, [collectionName, filterOptions]);

    return { documents };

};