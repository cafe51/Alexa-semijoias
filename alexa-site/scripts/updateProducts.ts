// Este é um módulo ES6
import { collection, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';
import { ProductBundleType, CategoryType, SectionType } from '../src/app/utils/types';

// Função para converter arrays de strings para minúsculas
const convertArrayToLowerCase = (arr: string[] | undefined | null): string[] => {
    if (!arr) return [];
    return arr.map(item => item.toLowerCase());
};

// Função principal que irá atualizar os documentos
export const updateProducts = async(db: Firestore = projectFirestoreDataBase) => {
    try {
        // Atualiza a coleção categories
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        
        const categoriesPromises = categoriesSnapshot.docs.map(async(docSnap) => {
            const data = docSnap.data() as CategoryType;
            const docRef = doc(db, 'categories', docSnap.id);
            
            return updateDoc(docRef, { 
                categoryName: data.categoryName.toLowerCase(),
            });
        });

        // Atualiza a coleção siteSections
        const sectionsCollection = collection(db, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsCollection);
        
        const sectionsPromises = sectionsSnapshot.docs.map(async(docSnap) => {
            const data = docSnap.data() as SectionType;
            const docRef = doc(db, 'siteSections', docSnap.id);
            
            return updateDoc(docRef, { 
                sectionName: data.sectionName.toLowerCase(),
                subsections: convertArrayToLowerCase(data.subsections),
            });
        });

        // Atualiza a coleção products
        const productsCollection = collection(db, 'products');
        const productsSnapshot = await getDocs(productsCollection);
        
        const productsPromises = productsSnapshot.docs.map(async(docSnap) => {
            const data = docSnap.data() as ProductBundleType;
            const docRef = doc(db, 'products', docSnap.id);
            
            return updateDoc(docRef, { 
                categories: convertArrayToLowerCase(data.categories),
                sections: convertArrayToLowerCase(data.sections),
                subsections: convertArrayToLowerCase(data.subsections),
            });
        });

        // Executa todas as promises
        await Promise.all([
            ...categoriesPromises,
            ...sectionsPromises,
            ...productsPromises,
        ]);

        console.log('Todas as coleções foram atualizadas com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar coleções:', error);
        throw error;
    }
};

// Se o arquivo for executado diretamente, chama a função
if (require.main === module) {
    updateProducts().catch((err) => console.error('Erro fatal:', err));
}
