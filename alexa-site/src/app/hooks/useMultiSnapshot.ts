// app/hooks/useMultiSnapshot.ts
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, Query } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../firebase/config';
import { FireBaseDocument } from '../utils/types';

export function useMultiSnapshot<T>(collectionName: string, filterOptionsArrays: any[][]) {
    const [documents, setDocuments] = useState<(T & FireBaseDocument)[]>([]);

    useEffect(() => {
    // Reinicia os documentos sempre que os filtros mudam
        setDocuments([]);
        const unsubscribers: (() => void)[] = [];

        filterOptionsArrays.forEach(options => {
            let ref: Query = collection(projectFirestoreDataBase, collectionName);
            if (options && options.length > 0) {
                const conditions = options.map(option =>
                    where(option.field, option.operator, option.value),
                );
                ref = query(ref, ...conditions);
            }

            const unsub = onSnapshot(ref, snapshot => {
                // Faz a asserção de tipo para garantir que os objetos sejam do tipo (T & FireBaseDocument)
                const docs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    exist: doc.exists(),
                    ...doc.data(),
                })) as (T & FireBaseDocument)[];
        
                setDocuments(prevDocs => {
                    // Remove duplicados (caso alguma query traga um documento já recebido)
                    const filtered = prevDocs.filter(d => !docs.some(nd => nd.id === d.id));
                    return [...filtered, ...docs];
                });
            });
            unsubscribers.push(unsub);
        });

        console.log('USE MULTISNAPSHOT:', documents);

        return () => {
            unsubscribers.forEach(unsub => unsub());
        };
    }, [collectionName, filterOptionsArrays]);

    return { documents };
}
