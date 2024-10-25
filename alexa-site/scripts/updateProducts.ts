// Este é um módulo ES6
import { collection, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';

// Função para extrair os dois dígitos do ID
const extractRandomIndex = (id: string): string => {
    // Pega o antepenúltimo e penúltimo dígitos do ID
    const digits = id.slice(-3, -1);
    return digits;
};

// Função principal que irá atualizar os documentos
export const updateProducts = async(db: Firestore = projectFirestoreDataBase) => {
    try {
        // Atualiza a coleção products
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        const productsPromises = productsSnapshot.docs.map(async(docSnap) => {
            const docRef = doc(db, 'products', docSnap.id);
            const randomIndex = extractRandomIndex(docSnap.id);
            
            return updateDoc(docRef, { 
                randomIndex: randomIndex,
            });
        });

        // Executa todas as promises
        await Promise.all(productsPromises);

        console.log('Campo randomIndex adicionado com sucesso em todos os produtos!');
    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        throw error;
    }
};

// Se o arquivo for executado diretamente, chama a função
if (require.main === module) {
    updateProducts().catch((err) => console.error('Erro fatal:', err));
}
