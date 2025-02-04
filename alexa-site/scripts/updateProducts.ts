// Este é um módulo ES6
import { collection, getDocs, updateDoc, doc, Firestore } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';
// import { ProductVariation } from '@/app/utils/types';
// import { createSlugName } from '@/app/utils/createSlugName';

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
            // const name = docSnap.data().name;
            // const slug = createSlugName(name);

            // const updatedProductVariationsWithValuesOfAllCustomPropertiesTrimmed = productVariations.map((pv) => {
            //     for (const property in pv.customProperties) {
            //         pv.customProperties[property] = pv.customProperties[property].trim();
            //     }
            //     return pv;
            // });

            const currentData = docSnap.data();
            const currentDescription = currentData.description || '';

            // Remove o texto adicional da descrição
            const textToRemove = '\n\n\nNossas semijoias são de alto padrão pois são cuidadosamente folheadas a ouro 18K com um banho reforçado, garantindo um brilho intenso e resistência superior.\n\nCom 1 ano de garantia, você pode usar suas peças com confiança, sabendo que elas foram feitas para te acompanhar em todos os momentos especiais.\n';
            const updatedDescription = currentDescription.replace(textToRemove, '');

            return updateDoc(docRef, {
                description: updatedDescription,
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
