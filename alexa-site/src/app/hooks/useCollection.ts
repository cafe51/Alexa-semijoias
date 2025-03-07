// app/hooks/useCollection.ts

import { projectFirestoreDataBase } from '../firebase/config';
import { CollectionReference, DocumentData, Query, Timestamp, writeBatch, addDoc, collection, doc, getDoc, query, where, deleteDoc, updateDoc, getDocs, setDoc, orderBy, limit, QueryConstraint, getCountFromServer } from 'firebase/firestore';
import { FilterOption, FireBaseDocument, OrderByOption } from '../utils/types';
import { useCallback, useMemo } from 'react';

export const useCollection = <T>(collectionName: string) => {
    const addDocument = useCallback(async(dataObj: T & { id?: string }, id?: string) => {
        console.log('useCollection: addDocument chamado');
        if (id) {
            // Define o ID específico
            console.log('projectFirestoreDataBase', projectFirestoreDataBase);
            console.log('collectionName', collectionName);
            console.log('dataObj', dataObj);
            console.log('id', id);
            const docRef = doc(projectFirestoreDataBase, collectionName, id);
            await setDoc(docRef, dataObj);
        } else {
            // Gera um ID automaticamente
            console.log('projectFirestoreDataBase', projectFirestoreDataBase);
            console.log('collectionName', collectionName);
            console.log('dataObj', dataObj);
            await addDoc(collection(projectFirestoreDataBase, collectionName), dataObj);
        }
    }, [collectionName]);
  
    const deleteDocument = useCallback(async(id: string) => {
        console.log('useCollection: deleteDocument chamado');
        await deleteDoc(doc(projectFirestoreDataBase, collectionName, id));
    }, [collectionName]);

    const deleteDocumentsByUserId = useCallback(async(userId: string) => {
        try {
            // Cria um batch
            const batch = writeBatch(projectFirestoreDataBase);
            // Cria a query para encontrar os documentos com o userId desejado
            const q = query(
                collection(projectFirestoreDataBase, collectionName),
                where('userId', '==', userId),
            );
            // Executa a query
            const snapshot = await getDocs(q);
            // Adiciona cada deleção ao batch
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            // Comita o batch para executar todas as deleções de uma vez
            await batch.commit();
            console.log('Documentos deletados com sucesso.');
        } catch (error) {
            console.error('Erro ao deletar documentos por userId:', error);
        }
    }, [collectionName]);

    const updateDocumentField = useCallback(async(id: string, field: string, value: string | number | string[] | number[] | object | null) => {
        try {
            const docRef = doc(projectFirestoreDataBase, collectionName, id);
            console.log('chamou update', id, field, value, docRef);
            await updateDoc(docRef, { [field]: value });
        } catch (error) {
            console.error('Erro ao atualizar documento:', error);
        }
    }, [collectionName]);

    const getDocumentById = useCallback(async(id: string): Promise<T & FireBaseDocument> => {
        console.log('useCollection: getDocumentById chamado');
        const docRef = doc(projectFirestoreDataBase, collectionName, id);
        const docSnap = await getDoc(docRef);

        console.log('getDocumentById');

        return {
            id: docSnap.id,
            exist: docSnap.exists(),
            ...(docSnap.data() as T),
        };
    }, [collectionName]);

    const getAllDocuments = useCallback(async(
        filterOptions?: FilterOption[] | null,
        itemsPerPage?: number,
        orderByOption?: OrderByOption,
    ): Promise<(T & FireBaseDocument)[]> => {
        console.log('useCollection: getAllDocuments chamado');
        let ref: Query | CollectionReference<DocumentData, DocumentData> = collection(projectFirestoreDataBase, collectionName);

        if (filterOptions) {
            const whereClauses = filterOptions.filter(option => option.operator && option.value);
            const orderClauses = filterOptions.filter(option => option.order);

            if (whereClauses.length > 0) {
                ref = query(ref, ...whereClauses.map(option => where(option.field, option.operator!, option.value!)));
            }

            if (orderClauses.length > 0) {
                orderClauses.forEach(option => {
                    ref = query(ref, orderBy(option.field, option.order!));
                });
            }
        }

        // Adiciona ordenação personalizada se especificada
        if (orderByOption) {
            ref = query(ref, orderBy(orderByOption.field, orderByOption.direction));
        }

        // Adiciona limite de documentos se itemsPerPage for especificado
        if (itemsPerPage) {
            ref = query(ref, limit(itemsPerPage));
        }

        const collectionSnapshot = await getDocs(ref);
        console.log('getAllDocuments');
        return collectionSnapshot.docs.map((doc) => ({
            id: doc.id,
            exist: doc.exists(),
            ...doc.data() as T,
        }));
    }, [collectionName]);
    
    const getDocumentsWithConstraints = useCallback(async(
        constraints: QueryConstraint[],
    ): Promise<(T & FireBaseDocument)[]> => {
        console.log('useCollection: getDocumentsWithConstraints chamado');
        const ref = collection(projectFirestoreDataBase, collectionName);
        const q = query(ref, ...constraints);
        const querySnapshot = await getDocs(q);

        console.log('getDocumentsWithConstraints');
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            exist: doc.exists(),
            ...doc.data() as T,
        }));
    }, [collectionName]);

    const getCompletedOrders = useCallback(async(): Promise<(T & FireBaseDocument)[]> => {
        console.log('useCollection: getCompletedOrders chamado');
        const constraints = [
            where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
        ];

        console.log('getCompletedOrders');

        return getDocumentsWithConstraints(constraints);
    }, [getDocumentsWithConstraints]);

    const getCount = useCallback(async(
        constraints?: QueryConstraint[],
    ): Promise<number> => {
        console.log('useCollection: getCount chamado');
        const ref = collection(projectFirestoreDataBase, collectionName);
        const q = constraints ? query(ref, ...constraints) : ref;
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    }, [collectionName]);

    const getActiveProductsCount = useCallback(async(): Promise<number> => {
        console.log('useCollection: getActiveProductsCount chamado');
        const constraints = [
            where('showProduct', '==', true),
            where('estoqueTotal', '>', 0),
        ];

        console.log('getActiveProductsCount');

        return getCount(constraints);
    }, [getCount]);

    const getRecentDocumentsCount = useCallback(async(
        dateField: string,
        fromDate: Date,
    ): Promise<number> => {
        console.log('useCollection: getRecentDocumentsCount chamado');
        const constraints = [
            where(dateField, '>=', Timestamp.fromDate(fromDate)),
        ];
        return getCount(constraints);
    }, [getCount]);

    const getCompletedOrdersCount = useCallback(async(): Promise<number> => {
        console.log('useCollection: getCompletedOrdersCount chamado');
        const constraints = [
            where('status', 'not-in', ['cancelado', 'aguardando pagamento']),
        ];

        console.log('getCompletedOrdersCount');

        return getCount(constraints);
    }, [getCount]);

    return useMemo(() => ({ 
        addDocument, 
        deleteDocument, 
        getDocumentById, 
        updateDocumentField, 
        getAllDocuments, 
        getCompletedOrders,
        getDocumentsWithConstraints,
        getCount,
        getActiveProductsCount,
        getRecentDocumentsCount,
        getCompletedOrdersCount,
        deleteDocumentsByUserId,
    }), [
        addDocument, 
        deleteDocument, 
        getDocumentById, 
        updateDocumentField, 
        getAllDocuments, 
        getCompletedOrders,
        getDocumentsWithConstraints,
        getCount,
        getActiveProductsCount,
        getRecentDocumentsCount,
        getCompletedOrdersCount,
        deleteDocumentsByUserId,
    ]);
};
