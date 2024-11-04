// app/hooks/usePaginatedQuery.ts

import { useEffect, useState, useCallback } from 'react';
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

    // Define a função para construir a query com base nas dependências
    const getQuery = useCallback((lastDoc?: DocumentData) => {
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if (filterOptions && filterOptions.length > 0) {
            const whereConditions = filterOptions.map(option => 
                where(option.field, option.operator, option.value),
            );
            ref = query(ref, ...whereConditions);
        }

        if (orderByOption) {
            ref = query(ref, orderBy(orderByOption.field, orderByOption.direction));
        }

        ref = query(ref, limit(itemsPerPage));

        if (lastDoc) {
            ref = query(ref, startAfter(lastDoc));
        }

        return ref;
    }, [collectionName, filterOptions, itemsPerPage, orderByOption]);

    // Define a função para carregar dados, com controle de timeout
    const loadData = useCallback(async(isInitial: boolean = true) => {
        setIsLoading(true);
        const q = getQuery(isInitial ? undefined : (lastVisible || undefined));

        try {
            const snapshot = await getDocs(q);
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                exist: doc.exists(),
                ...doc.data() as T,
            }));

            // Define um tempo de espera arbitrário (exemplo: 1 segundo)
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
        } catch (error) {
            console.error('Error fetching paginated documents:', error);
        }
    }, [getQuery, itemsPerPage, lastVisible]);


    // Função de carregar mais documentos
    const loadMore = useCallback(() => {
        if (!lastVisible || isLoading || !hasMore) return;
        loadData(false);
    }, [lastVisible, isLoading, hasMore, loadData]);

    // Função para resetar o estado e carregar dados do início
    const refresh = useCallback(() => {
        setDocuments(null);
        setLastVisible(null);
        setHasMore(true);
        loadData(true);
    }, [loadData]);

    // useEffect para carregar dados iniciais somente na primeira renderização ou quando os filtros mudarem
    useEffect(() => {
        loadData(true);

        // Limpeza de dados ao desmontar
        return () => {
            setDocuments(null);
            setLastVisible(null);
            setHasMore(true);
        };
    }, [collectionName, filterOptions, itemsPerPage, orderByOption]);

    useEffect(() => {console.log('documents AAAAAAAAAAAAAAAaa', documents); }, [documents]);

    return { documents, isLoading, hasMore, loadMore, refresh };
};
