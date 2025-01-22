import { collection, getDocs, query, where } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../firebase/config';

interface CheckDuplicateResult {
    isDuplicate: boolean;
    field?: string;
}

export const checkDuplicateFields = async(
    collectionName: string,
    fields: { [key: string]: string },
): Promise<CheckDuplicateResult> => {
    try {
        // Cria um array de promessas para cada campo que precisa ser verificado
        const queries = Object.entries(fields).map(async([field, value]) => {
            if (!value) return null;

            const q = query(
                collection(projectFirestoreDataBase, collectionName),
                where(field, '==', value),
            );

            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                return field;
            }
            return null;
        });

        // Executa todas as queries em paralelo
        const results = await Promise.all(queries);
        
        // Filtra os resultados nulos e pega o primeiro campo duplicado encontrado
        const duplicateField = results.find(result => result !== null);

        if (duplicateField) {
            return {
                isDuplicate: true,
                field: duplicateField,
            };
        }

        return { isDuplicate: false };
    } catch (error) {
        console.error('Erro ao verificar duplicidade:', error);
        throw new Error('Erro ao verificar duplicidade dos campos');
    }
};
