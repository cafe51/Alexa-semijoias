import { useEffect, useRef, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, collection, query, where, limit, startAfter, onSnapshot } from 'firebase/firestore';
import { FilterOptionForUseSnapshot, FireBaseDocument } from '../utils/types';

export const useSnapshotPag = <T>(
    collectionName: string,
    filterOptions: FilterOptionForUseSnapshot[] | null,
    itemsPerPage: number = 10,
) => {
    const [documents, setDocuments] = useState<(T & FireBaseDocument)[] | null>(null);
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    const getQuery = (lastDoc?: DocumentData) => {
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if (filterOptions && filterOptions.length > 0) {
            const whereConditions = filterOptions.map(option => 
                where(option.field, option.operator, option.value),
            );
            ref = query(ref, ...whereConditions);
        }

        ref = query(ref, limit(itemsPerPage));

        if (lastDoc) {
            ref = query(ref, startAfter(lastDoc));
        }

        return ref;
    };

    const loadData = (isInitial: boolean = true) => {
        setIsLoading(true);
        const q = getQuery(isInitial ? undefined : (lastVisible || undefined));

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        unsubscribeRef.current = onSnapshot(q, (snapshot) => {
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                exist: doc.exists(),
                ...doc.data() as T,
            }));

            const remainingTime = Math.max(0, 1000);

            setTimeout(() => {
                if (isInitial) {
                    setDocuments(results);
                } else {
                    setDocuments(prev => prev ? [...prev, ...results] : results);
                }

                setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
                setHasMore(snapshot.docs.length === itemsPerPage);
                setIsLoading(false);
            }, remainingTime);
        });
    };

    const loadMore = () => {
        if (!lastVisible || isLoading) return;
        loadData(false);
    };

    useEffect(() => {
        loadData();

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [collectionName, filterOptions, itemsPerPage]);

    useEffect(() => {console.log('documents AAAAAAAAAAAAAAAaa', documents); }, [documents]);

    return { documents, isLoading, hasMore, loadMore };
};
