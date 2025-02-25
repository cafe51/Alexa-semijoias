import adjustPriceTo99 from '@/app/utils/adjustPriceTo99';
import { adminDb } from '../src/app/firebase/admin-config';
import { ProductBundleType } from '@/app/utils/types';

/**
 * Função principal que atualiza os documentos em batches de 50
 */
export const updateProducts = async() => {
    try {
    // Obtém todos os documentos da coleção "products"
        const productsCollectionRef = adminDb.collection('products');
        const snapshot = await productsCollectionRef.get();
        const allDocs = snapshot.docs;

        console.log(`Total de documentos a atualizar: ${allDocs.length}`);

        const batchSize = 20;

        // Processa os documentos em batches
        for (let i = 0; i < allDocs.length; i += batchSize) {
            const currentBatchDocs = allDocs.slice(i, i + batchSize);
            console.log(`Atualizando documentos ${i + 1} até ${i + currentBatchDocs.length}...`);

            // Cria um batch de escrita
            const batch = adminDb.batch();

            currentBatchDocs.forEach((docSnap) => {
                const docRef = docSnap.ref;
                const docData = docSnap.data() as ProductBundleType;



                if(docData.value.cost && (docData.value.cost >= 0)) {
                    const costPrice = docData.value.cost;

                    // const costPrice = (docData.value.cost <= 0) ? 10 : docData.value.cost;

                    const valuePrice = costPrice * 7;
                    const newValue: ProductBundleType['value']  = {
                        ...docData.value,
                        price: adjustPriceTo99(valuePrice),
                    };
    
        
                    // Atualiza cada variação do produto com as seções e subseções
                    const newProductVariations: ProductBundleType['productVariations'] = docData.productVariations.map(
                        (variation) => ({
                            ...variation,
                            value: newValue,
                        }),
                    );
    
                    const finalPrice = docData.value.promotionalPrice ? docData.value.promotionalPrice : newValue.price;
        
                    batch.update(docRef, {
                        value: newValue,
                        productVariations: newProductVariations,
                        finalPrice: finalPrice,
                    });
                }

            });

            // Comita o batch atual
            await batch.commit();
            console.log(
                `Batch de documentos ${i + 1} até ${i + currentBatchDocs.length} atualizado com sucesso.`,
            );

            // Delay opcional de 1 segundo entre os batches para verificação
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log('Todos os produtos foram atualizados com sucesso.');
    } catch (error) {
        console.error('Erro ao atualizar produtos:', error);
        throw error;
    }
};
