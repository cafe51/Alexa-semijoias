// app/hooks/usePaginatedQuery.ts

import { useEffect, useState } from 'react';
import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, collection, query, where, limit, startAfter, getDocs, orderBy } from 'firebase/firestore';
import { FilterOptionForUseSnapshot, FireBaseDocument } from '../utils/types';

type OrderByOption = {
    field: string;
    direction: 'asc' | 'desc';
} | null;

export const usePaginatedQuery = <T>(
    collectionName: string,
    filterOptions: FilterOptionForUseSnapshot[] | null,
    itemsPerPage: number = 10,
    orderByOption: OrderByOption = null,
) => {
    const [documents, setDocuments] = useState<(T & FireBaseDocument)[] | null>(null);
    const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const getQuery = (lastDoc?: DocumentData) => {
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if (filterOptions && filterOptions.length > 0) {
            const whereConditions = filterOptions.map(option => 
                where(option.field, option.operator, option.value),
            );
            ref = query(ref, ...whereConditions);
        }

        // Adiciona ordenação se especificada
        if (orderByOption) {
            ref = query(ref, orderBy(orderByOption.field, orderByOption.direction));
        }

        ref = query(ref, limit(itemsPerPage));

        if (lastDoc) {
            ref = query(ref, startAfter(lastDoc));
        }

        return ref;
    };

    const loadData = async(isInitial: boolean = true) => {
        setIsLoading(true);
        const q = getQuery(isInitial ? undefined : lastVisible);

        try {
            const snapshot = await getDocs(q);
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                exist: doc.exists(),
                ...doc.data() as T,
            }));

            if (isInitial) {
                setDocuments(results);
            } else {
                setDocuments(prev => prev ? [...prev, ...results] : results);
            }

            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setHasMore(snapshot.docs.length === itemsPerPage);
        } catch (error) {
            console.error('Error fetching paginated documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadMore = () => {
        if (!lastVisible || isLoading || !hasMore) return;
        loadData(false);
    };

    useEffect(() => {
        loadData();

        // Limpeza de dados quando mudar a coleção ou filtros
        return () => {
            setDocuments(null);
            setLastVisible(null);
            setHasMore(true);
        };
    }, [collectionName, filterOptions, itemsPerPage, orderByOption]);

    return { documents, isLoading, hasMore, loadMore };
};
