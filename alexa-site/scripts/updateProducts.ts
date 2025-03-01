import { adminDb } from '../src/app/firebase/admin-config';
import { ProductBundleType } from '@/app/utils/types';
import keyWordsCreator from '@/app/utils/keyWordsCreator';

/**
 * Atualiza os documentos da coleção "products" em batches.
 * Em caso de erro em um documento, captura o erro e continua a execução.
 * Ao final, exibe a lista dos documentos que não puderam ser atualizados.
 */
export const updateProducts = async() => {
    // Lista para armazenar os documentos que causaram erro
    const failedDocs: { id: string; name: string }[] = [];

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
            console.log(
                `Atualizando documentos ${i + 1} até ${i + currentBatchDocs.length}...`,
            );

            // Atualiza cada documento individualmente
            for (const docSnap of currentBatchDocs) {
                const docRef = docSnap.ref;
                const docData = docSnap.data() as ProductBundleType;

                // Gera keyWords a partir dos campos do documento
                const categoriesKeyWords =
          docData.categories && docData.categories.length > 0
              ? docData.categories.map((cat) => keyWordsCreator(cat)).flat()
              : [];
                const sectionsKeyWords =
          docData.sections && docData.sections.length > 0
              ? docData.sections.map((sec) => keyWordsCreator(sec)).flat()
              : [];
                const subsectionsKeyWords =
          docData.subsections && docData.subsections.length > 0
              ? docData.subsections
                  .map((sub) => {
                  // Considera que o formato é 'sectionName:subsectionName'
                      const parts = sub.split(':');
                      return parts.length > 1 ? keyWordsCreator(parts[1]) : [];
                  })
                  .flat()
              : [];

                const newKeyWords: ProductBundleType['keyWords'] = Array.from(
                    new Set([
                        ...keyWordsCreator(docData.name.trim().toLowerCase()),
                        ...categoriesKeyWords,
                        ...sectionsKeyWords,
                        ...subsectionsKeyWords,
                    ]),
                );

                console.log('************************8');
                console.log('newKeyWords length, ', newKeyWords.length);
                console.log('************************8');

                // Tenta atualizar o documento
                try {
                    await docRef.update({
                        keyWords: newKeyWords,
                    });
                } catch (error) {
                    console.error(
                        `Erro ao atualizar documento ${docRef.id} (${docData.name}):`,
                        error,
                    );
                    failedDocs.push({ id: docRef.id, name: docData.name });
                }
            }

            // Delay opcional entre os batches
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    } catch (error) {
        console.error('Erro geral ao atualizar produtos:', error);
    }

    // Exibe os documentos que não foram atualizados com sucesso
    if (failedDocs.length > 0) {
        console.log('Documentos que causaram erro:');
        failedDocs.forEach((doc) =>
            console.log(`ID: ${doc.id}, Name: ${doc.name}`),
        );
    } else {
        console.log('Todos os produtos foram atualizados com sucesso.');
    }
};
