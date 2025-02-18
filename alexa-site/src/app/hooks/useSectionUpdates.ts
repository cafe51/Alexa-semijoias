import { useCollection } from './useCollection';
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';

export const useSectionUpdates = () => {
    const productsCollection = useCollection<ProductBundleType>('products');

    // Função auxiliar para processar atualizações em lotes de 20
    const batchProcess = async <T>(items: T[], callback: (item: T) => Promise<void>) => {
        const chunkSize = 20;
        for (let i = 0; i < items.length; i += chunkSize) {
            const chunk = items.slice(i, i + chunkSize);
            await Promise.all(chunk.map(callback));
        }
    };

    const updateProductsOnSectionNameChange = async(oldName: string, newName: string) => {
        const products = await productsCollection.getAllDocuments([
            { field: 'sections', operator: 'array-contains', value: oldName },
        ]);
        await batchProcess(products, async(product) => {
            const updatedSections = product.sections.map((s: string) => (s === oldName ? newName : s));
            if (JSON.stringify(updatedSections) !== JSON.stringify(product.sections)) {
                await productsCollection.updateDocumentField(product.id, 'sections', updatedSections);
            }
            if (product.subsections && Array.isArray(product.subsections)) {
                const updatedSubs = product.subsections.map((sub: string) => {
                    const [sec, subName] = sub.split(':');
                    return sec === oldName ? `${newName}:${subName}` : sub;
                });
                if (JSON.stringify(updatedSubs) !== JSON.stringify(product.subsections)) {
                    await productsCollection.updateDocumentField(product.id, 'subsections', updatedSubs);
                }
            }
        });
    };

    const updateProductsOnSubsectionsChange = async(
        sectionName: string,
        oldSubs: string[],
        newSubs: string[],
    ) => {
    // Calcula as subseções que foram removidas
        const removedSubs = oldSubs.filter(sub => !newSubs.includes(sub));
        if (removedSubs.length === 0) return;

        const updatedProductsMap = new Map<string, ProductBundleType & FireBaseDocument>();
        for (const removedSub of removedSubs) {
            const products = await productsCollection.getAllDocuments([
                { field: 'subsections', operator: 'array-contains', value: `${sectionName}:${removedSub}` },
            ]);
            for (const product of products) {
                updatedProductsMap.set(product.id, product);
            }
        }
        const updatedProducts = Array.from(updatedProductsMap.values());
        await batchProcess(updatedProducts, async(product) => {
            if (product.subsections && Array.isArray(product.subsections)) {
                const updatedSubs = product.subsections.filter((sub) => {
                    return !removedSubs.some(r => sub === `${sectionName}:${r}`);
                });
                if (updatedSubs.length !== product.subsections.length) {
                    await productsCollection.updateDocumentField(product.id, 'subsections', updatedSubs);
                }
            }
        });
    };

    const removeSectionFromProducts = async(sectionName: string) => {
        const products = await productsCollection.getAllDocuments([
            { field: 'sections', operator: 'array-contains', value: sectionName },
        ]);
        await batchProcess(products, async(product) => {
            const updatedSections = product.sections.filter((s: string) => s !== sectionName);
            if (updatedSections.length !== product.sections.length) {
                await productsCollection.updateDocumentField(product.id, 'sections', updatedSections);
            }
            if (product.subsections && Array.isArray(product.subsections)) {
                const updatedSubs = product.subsections.filter((sub: string) => !sub.startsWith(`${sectionName}:`));
                if (updatedSubs.length !== product.subsections.length) {
                    await productsCollection.updateDocumentField(product.id, 'subsections', updatedSubs);
                }
            }
        });
    };

    const removeSubsectionFromProducts = async(sectionName: string, subsectionName: string) => {
        const products = await productsCollection.getAllDocuments([
            {
                field: 'subsections',
                operator: 'array-contains',
                value: `${sectionName}:${subsectionName}`,
            },
        ]);
        await batchProcess(products, async(product) => {
            if (product.subsections && Array.isArray(product.subsections)) {
                const updatedSubs = product.subsections.filter(
                    (sub: string) => sub !== `${sectionName}:${subsectionName}`,
                );
                if (updatedSubs.length !== product.subsections.length) {
                    await productsCollection.updateDocumentField(product.id, 'subsections', updatedSubs);
                }
            }
        });
    };

    return {
        updateProductsOnSectionNameChange,
        updateProductsOnSubsectionsChange,
        removeSectionFromProducts,
        removeSubsectionFromProducts,
    };
};
