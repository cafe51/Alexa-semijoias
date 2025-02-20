import { useState, useCallback, useEffect } from 'react';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { collection, query, where, getDocs, orderBy, limit, startAfter, QueryConstraint, getCountFromServer, DocumentData } from 'firebase/firestore';
import { FilterOptionForUseSnapshot, FireBaseDocument } from '@/app/utils/types';

type OrderByOption = {
    field: string;
    direction: 'asc' | 'desc';
} | null;

export const useNumberedPagination = <T>(
    collectionName: string,
    filterOptions: FilterOptionForUseSnapshot[] | null,
    itemsPerPage: number | 'all' = 10,
    orderByOption: OrderByOption = null,
) => {
    const [documents, setDocuments] = useState<(T & FireBaseDocument)[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [allDocumentRefs, setAllDocumentRefs] = useState<DocumentData[]>([]);

    // Função para obter o total de documentos e calcular o número total de páginas
    const fetchTotalPages = useCallback(async() => {
        try {
            const ref = collection(projectFirestoreDataBase, collectionName);
            let queryConstraints: QueryConstraint[] = [];

            if (filterOptions && filterOptions.length > 0) {
                queryConstraints = filterOptions.map(option => 
                    where(option.field, option.operator, option.value),
                );
            }

            const q = query(ref, ...queryConstraints);
            const snapshot = await getCountFromServer(q);
            const total = snapshot.data().count;
            setTotalDocuments(total);
            if (itemsPerPage === 'all') {
                setTotalPages(1);
            } else {
                setTotalPages(Math.ceil(total / itemsPerPage));
            }

            // Busca todas as referências dos documentos ordenados (somente se necessário para paginação)
            if (orderByOption && itemsPerPage !== 'all') {
                const orderedQuery = query(
                    ref,
                    ...queryConstraints,
                    orderBy(orderByOption.field, orderByOption.direction),
                );
                const orderedSnapshot = await getDocs(orderedQuery);
                setAllDocumentRefs(orderedSnapshot.docs);
            }
        } catch (error) {
            console.error('Erro ao buscar total de páginas:', error);
            setError('Falha ao carregar informações de paginação');
        }
    }, [collectionName, filterOptions, itemsPerPage, orderByOption]);

    // Função para buscar documentos da página atual
    const fetchPage = useCallback(async(page: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const ref = collection(projectFirestoreDataBase, collectionName);
            let queryConstraints: QueryConstraint[] = [];

            if (filterOptions && filterOptions.length > 0) {
                queryConstraints = filterOptions.map(option => 
                    where(option.field, option.operator, option.value),
                );
            }

            if (orderByOption) {
                queryConstraints.push(orderBy(orderByOption.field, orderByOption.direction));
            }

            if (itemsPerPage === 'all') {
                // Busca todos os documentos de uma única vez
                const q = query(ref, ...queryConstraints);
                const snapshot = await getDocs(q);
                const results = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    exist: doc.exists(),
                    ...doc.data() as T,
                }));
                setDocuments(results);
            } else {
                // Paginação tradicional usando limit e startAfter
                const startIndex = (page - 1) * itemsPerPage;
                
                if (page > 1 && allDocumentRefs[startIndex - 1]) {
                    queryConstraints.push(startAfter(allDocumentRefs[startIndex - 1]));
                }

                queryConstraints.push(limit(itemsPerPage));

                const q = query(ref, ...queryConstraints);
                const snapshot = await getDocs(q);

                const results = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    exist: doc.exists(),
                    ...doc.data() as T,
                }));

                setDocuments(results);
            }
        } catch (error) {
            console.error('Erro ao buscar documentos:', error);
            setError('Falha ao carregar produtos');
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, filterOptions, itemsPerPage, orderByOption, allDocumentRefs]);

    // Função para mudar de página
    const goToPage = useCallback((page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    }, [totalPages]);

    // Efeito para buscar o total de páginas na montagem do componente ou quando os filtros/itens por página mudam
    useEffect(() => {
        fetchTotalPages();
    }, [fetchTotalPages]);

    // Efeito para buscar documentos quando a página atual muda ou quando os itens por página mudam
    useEffect(() => {
        fetchPage(currentPage);
    }, [currentPage, fetchPage]);
    
    return {
        documents,
        isLoading,
        error,
        currentPage,
        totalPages,
        totalDocuments,
        goToPage,
        refresh: () => {
            fetchTotalPages();
            fetchPage(1);
        },
    };
};
