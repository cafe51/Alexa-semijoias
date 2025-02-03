// Este é um módulo ES6
import { collection, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';
// import { ProductVariation } from '@/app/utils/types';
import { createSlugName } from '@/app/utils/createSlugName';

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
            // const productVariations = docSnap.data().productVariations as ProductVariation[];
            const name = docSnap.data().name;
            const slug = createSlugName(name);

            // const updatedProductVariationsWithValuesOfAllCustomPropertiesTrimmed = productVariations.map((pv) => {
            //     for (const property in pv.customProperties) {
            //         pv.customProperties[property] = pv.customProperties[property].trim();
            //     }
            //     return pv;
            // });

            return updateDoc(docRef, {
                // name: name.toLowerCase().trim(),
                slug, // adiciona o campo slug
                // productVariations: updatedProductVariationsWithValuesOfAllCustomPropertiesTrimmed,
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
