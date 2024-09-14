// app/hooks/useSnapshot.ts
import { useEffect, useRef, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, collection, query, where, onSnapshot } from 'firebase/firestore';
import { FilterOptionForUseSnapshot, FireBaseDocument } from '../utils/types';
import { useAuthContext } from './useAuthContext';

export const useSnapshot = <T>(collectionName: string, filterOptions: FilterOptionForUseSnapshot[] | null) => {
    const [documents, setDocuments] = useState<(T & FireBaseDocument)[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const { user } = useAuthContext();

    useEffect(() => {
        if (!user) {
            setDocuments(null);
            setError('Usuário não autenticado');
            return;
        }

        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if (filterOptions && filterOptions.length > 0 && filterOptions) {
            // Cria um array de condições where
            const whereConditions = filterOptions.map(option => 
                where(option.field, option.operator, option.value),
            );

            // Aplica todas as condições where na função query
            ref = query(ref, ...whereConditions); 
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
            }, 150); 
        });
        
        console.log('USESNAPSHOT:', documents);
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            unsub();
        };

    }, [collectionName, filterOptions, user]);

    return { documents, error };
};