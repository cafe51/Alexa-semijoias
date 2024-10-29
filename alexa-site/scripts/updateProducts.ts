// Este é um módulo ES6
import { collection, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';
import keyWordsCreator from '@/app/utils/keyWordsCreator';


// Função principal que irá atualizar os documentos
export const updateProducts = async(db: Firestore = projectFirestoreDataBase) => {
    try {
        // sections: string[],
        // subsections?: string[], // do tipo 'sectionName:subsectionName'[]
        // categories: string[],
        // Referência para a coleção 'products'
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        const productsPromises = productsSnapshot.docs.map(async(docSnap) => {
            const docRef = doc(db, 'products', docSnap.id);
            const name = docSnap.data().name;
            const categories = docSnap.data().categories;
            const sections = docSnap.data().sections;
            const subsections = docSnap.data().subsections.map((sub: string) => sub.split(':')[1]);

            // Cria o array de keywords usando keyWordsCreator
            const keyWords = keyWordsCreator(name.toLowerCase());

            // Atualiza o documento com os campos `name` (em lowercase) e `keyWords`
            return updateDoc(docRef, {
                name: name.toLowerCase(),
                keyWords: [...keyWords, ...categories, ...sections, ...subsections],
            });
        });

        // Executa todas as promessas
        await Promise.all(productsPromises);
        console.log('Todos os produtos foram atualizados com sucesso.');

    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        throw error;
    }
};
// Se o arquivo for executado diretamente, chama a função
if (require.main === module) {
    updateProducts().catch((err) => console.error('Erro fatal:', err));
}
