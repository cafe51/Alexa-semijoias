// src/app/admin/carrinhos/useDocument.ts
import { useState, useEffect } from 'react';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument } from '@/app/utils/types';

export function useDocument<T>(collectionName: string, id: string) {
    const [document, setDocument] = useState<(T & FireBaseDocument) | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const { getDocumentById } = useCollection<T>(collectionName);

    useEffect(() => {
        let isMounted = true;
        const fetchDoc = async() => {
            setLoading(true);
            try {
                const doc = await getDocumentById(id);
                if (isMounted) setDocument(doc);
            } catch (err) {
                if (isMounted) setError(err as Error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchDoc();
        return () => { isMounted = false; };
    }, [collectionName, id, getDocumentById]);

    return { document, loading, error };
}
