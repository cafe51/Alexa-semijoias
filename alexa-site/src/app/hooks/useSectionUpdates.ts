import { updateDoc, doc } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { useCollection } from './useCollection';
import { ProductBundleType } from '@/app/utils/types';

export const useSectionUpdates = () => {
    const productsCollection = useCollection<ProductBundleType>('products');

    const updateProductsOnSectionNameChange = async(
        oldSectionName: string,
        newSectionName: string,
    ) => {
        const products = await productsCollection.getAllDocuments([
            { field: 'sections', operator: 'array-contains', value: oldSectionName },
        ]);

        await Promise.all(
            products.map(async(product) => {
                // Atualiza o array de sections
                const updatedSections = product.sections.map((s) =>
                    s === oldSectionName ? newSectionName : s,
                );

                // Atualiza o array de subsections do produto (formato "section:subsection")
                const updatedSubsections = product.subsections
                    ? product.subsections.map((sub) => {
                        if (sub.startsWith(`${oldSectionName}:`)) {
                            return sub.replace(`${oldSectionName}:`, `${newSectionName}:`);
                        }
                        return sub;
                    })
                    : product.subsections;

                // Atualiza também os arrays aninhados em productVariations
                const updatedProductVariations = product.productVariations
                    ? product.productVariations.map((variation) => {
                        const varUpdatedSections = variation.sections.map((s) =>
                            s === oldSectionName ? newSectionName : s,
                        );
                        const varUpdatedSubsections = variation.subsections
                            ? variation.subsections.map((sub) => {
                                if (sub.startsWith(`${oldSectionName}:`)) {
                                    return sub.replace(
                                        `${oldSectionName}:`,
                                        `${newSectionName}:`,
                                    );
                                }
                                return sub;
                            })
                            : variation.subsections;
                        return {
                            ...variation,
                            sections: varUpdatedSections,
                            subsections: varUpdatedSubsections,
                        };
                    })
                    : product.productVariations;

                await updateDoc(doc(projectFirestoreDataBase, 'products', product.id), {
                    sections: updatedSections,
                    subsections: updatedSubsections,
                    productVariations: updatedProductVariations,
                });
            }),
        );
    };

    const updateProductsOnSubsectionsChange = async(
        sectionName: string,
        oldSubsections: string[],
        newSubsections: string[],
    ) => {
        const products = await productsCollection.getAllDocuments([
            { field: 'sections', operator: 'array-contains', value: sectionName },
        ]);

        await Promise.all(
            products.map(async(product) => {
                // Para cada produto, percorre os itens do array de subsections (formato "section:subsection")
                const updatedSubsections = product.subsections
                    ? product.subsections
                        .map((sub) => {
                            if (sub.startsWith(`${sectionName}:`)) {
                                const currentSub = sub.split(':')[1];
                                const idx = oldSubsections.indexOf(currentSub);
                                if (idx !== -1 && newSubsections[idx]?.trim()) {
                                    return `${sectionName}:${newSubsections[idx].trim()}`;
                                }
                                // Se não houver correspondência (por exemplo, foi removida), retorna null para filtrar
                                return null;
                            }
                            return sub;
                        })
                        .filter((sub) => sub !== null) as string[]
                    : product.subsections;

                // Atualiza também os productVariations
                const updatedProductVariations = product.productVariations
                    ? product.productVariations.map((variation) => {
                        const updatedVarSubsections = variation.subsections
                            ? variation.subsections
                                .map((sub) => {
                                    if (sub.startsWith(`${sectionName}:`)) {
                                        const currentSub = sub.split(':')[1];
                                        const idx = oldSubsections.indexOf(currentSub);
                                        if (idx !== -1 && newSubsections[idx]?.trim()) {
                                            return `${sectionName}:${newSubsections[idx].trim()}`;
                                        }
                                        return null;
                                    }
                                    return sub;
                                })
                                .filter((sub) => sub !== null) as string[]
                            : variation.subsections;
                        return {
                            ...variation,
                            subsections: updatedVarSubsections,
                        };
                    })
                    : product.productVariations;

                await updateDoc(doc(projectFirestoreDataBase, 'products', product.id), {
                    subsections: updatedSubsections,
                    productVariations: updatedProductVariations,
                });
            }),
        );
    };

    const removeSectionFromProducts = async(sectionName: string) => {
        const products = await productsCollection.getAllDocuments([
            { field: 'sections', operator: 'array-contains', value: sectionName },
        ]);
        await Promise.all(
            products.map(async(product) => {
                const updatedSections = product.sections.filter(
                    (s) => s !== sectionName,
                );
                const updatedSubsections = product.subsections
                    ? product.subsections.filter((sub) => !sub.startsWith(`${sectionName}:`))
                    : product.subsections;
                const updatedProductVariations = product.productVariations
                    ? product.productVariations.map((variation) => {
                        const varUpdatedSections = variation.sections.filter(
                            (s) => s !== sectionName,
                        );
                        const varUpdatedSubsections = variation.subsections
                            ? variation.subsections.filter(
                                (sub) => !sub.startsWith(`${sectionName}:`),
                            )
                            : variation.subsections;
                        return {
                            ...variation,
                            sections: varUpdatedSections,
                            subsections: varUpdatedSubsections,
                        };
                    })
                    : product.productVariations;
                await updateDoc(doc(projectFirestoreDataBase, 'products', product.id), {
                    sections: updatedSections,
                    subsections: updatedSubsections,
                    productVariations: updatedProductVariations,
                });
            }),
        );
    };

    const removeSubsectionFromProducts = async(
        sectionName: string,
        subsection: string,
    ) => {
        const products = await productsCollection.getAllDocuments([
            {
                field: 'subsections',
                operator: 'array-contains',
                value: `${sectionName}:${subsection}`,
            },
        ]);
        await Promise.all(
            products.map(async(product) => {
                const updatedSubsections = product.subsections
                    ? product.subsections.filter((sub) => sub !== `${sectionName}:${subsection}`)
                    : product.subsections;
                const updatedProductVariations = product.productVariations
                    ? product.productVariations.map((variation) => {
                        const updatedVarSubsections = variation.subsections
                            ? variation.subsections.filter(
                                (sub) => sub !== `${sectionName}:${subsection}`,
                            )
                            : variation.subsections;
                        return {
                            ...variation,
                            subsections: updatedVarSubsections,
                        };
                    })
                    : product.productVariations;
                await updateDoc(doc(projectFirestoreDataBase, 'products', product.id), {
                    subsections: updatedSubsections,
                    productVariations: updatedProductVariations,
                });
            }),
        );
    };

    return {
        updateProductsOnSectionNameChange,
        updateProductsOnSubsectionsChange,
        removeSectionFromProducts,
        removeSubsectionFromProducts,
    };
};
