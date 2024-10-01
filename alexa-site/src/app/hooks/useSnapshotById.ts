// app/hooks/useSnapshotById.ts
import { useEffect, useRef, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { FireBaseDocument } from '../utils/types';

export const useSnapshotById = <T>(collectionName: string, documentId: string) => {
    const [document, setDocument] = useState<(T & FireBaseDocument) | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log('useSnapshotByID com ID: ', documentId);
        if (!documentId) return;

        const docRef = doc(projectFirestoreDataBase, collectionName, documentId);

        const unsub = onSnapshot(docRef, (docSnapshot) => {
            const result = {
                id: docSnapshot.id,
                exist: docSnapshot.exists(),
                ...docSnapshot.data() as T,
            };

            if (timerRef.current) clearTimeout(timerRef.current);

            timerRef.current = setTimeout(() => {
                setDocument(result);
            }, 150);
        });

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            unsub();
        };
    }, [collectionName, documentId]);

    return { document };
};
