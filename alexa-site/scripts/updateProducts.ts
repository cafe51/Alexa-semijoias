import { collection, getDocs, doc, Firestore, updateDoc } from 'firebase/firestore';
import { projectFirestoreDataBase } from '../src/app/firebase/config';
import { ProductBundleType } from '../functions/src/types';

// Função principal que atualiza os documentos em batches de 50
export const updateProducts = async(db: Firestore = projectFirestoreDataBase) => {
    try {
    // Obtém todos os documentos da coleção "products"
        const docsCollection = collection(db, 'products');
        const docsSnapshot = await getDocs(docsCollection);
        const allDocs = docsSnapshot.docs;

        console.log(`Total de documentos a atualizar: ${allDocs.length}`);

        const batchSize = 50;

        // Processa os documentos em batches
        for (let i = 0; i < allDocs.length; i += batchSize) {
            const currentBatchDocs = allDocs.slice(i, i + batchSize);
            console.log(`Atualizando documentos ${i + 1} até ${i + currentBatchDocs.length}...`);

            // Cria as promessas de atualização para o batch atual
            const batchPromises = currentBatchDocs.map(async(docSnap) => {
                const docRef = doc(db, 'products', docSnap.id);
                const docData = docSnap.data() as ProductBundleType;

                const productSections = docData.sections;
                const productSubsections = docData.subsections;

                // Atualiza cada variação do produto com as seções e subseções
                const newProductVariations: ProductBundleType['productVariations'] = docData.productVariations.map((variation) => ({
                    ...variation,
                    sections: productSections,
                    subsections: productSubsections,
                }));

                return updateDoc(docRef, {
                    productVariations: newProductVariations,
                });
            });

            // Aguarda todas as atualizações do batch atual
            await Promise.all(batchPromises);
            console.log(`Batch de documentos ${i + 1} até ${i + currentBatchDocs.length} atualizado com sucesso.`);

            // Delay opcional de 1 segundo entre os batches para verificação
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log('Todos os produtos foram atualizados com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        throw error;
    }
};
