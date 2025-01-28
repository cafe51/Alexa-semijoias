import { useState, useCallback, useEffect } from 'react';
import { useCollection } from './useCollection';
import { where } from 'firebase/firestore';
import { CategoryType, ProductBundleType } from '../utils/types';

type CategoryWithCount = {
    categoryName: string;
    productCount: number;
};

export const useCategoryManager = () => {
    const [categories, setCategories] = useState<CategoryWithCount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const categoriesCollection = useCollection<CategoryType>('categories');
    const productsCollection = useCollection<ProductBundleType>('products');

    const fetchCategories = useCallback(async() => {
        try {
            setIsLoading(true);
            setError(null);
            
            const categoriesList = await categoriesCollection.getAllDocuments();
            
            const categoriesWithCount = await Promise.all(
                categoriesList.map(async(category) => {
                    const count = await productsCollection.getCount([
                        where('categories', 'array-contains', category.categoryName),
                    ]);
                    
                    return {
                        categoryName: category.categoryName,
                        productCount: count,
                    };
                }),
            );

            setCategories(categoriesWithCount);
        } catch (err) {
            setError('Erro ao carregar categorias');
            console.error('Erro ao carregar categorias:', err);
        } finally {
            setIsLoading(false);
        }
    }, [categoriesCollection, productsCollection]);

    const getProductsByCategory = useCallback(async(categoryName: string) => {
        try {
            return await productsCollection.getDocumentsWithConstraints([
                where('categories', 'array-contains', categoryName),
            ]);
        } catch (err) {
            console.error('Erro ao buscar produtos por categoria:', err);
            throw new Error('Erro ao buscar produtos por categoria');
        }
    }, [productsCollection]);

    const deleteCategory = useCallback(async(categoryName: string) => {
        try {
            // Buscar todos os produtos que contêm esta categoria
            const productsWithCategory = await getProductsByCategory(categoryName);
            
            // Atualizar cada produto removendo a categoria
            await Promise.all(
                productsWithCategory.map(async(product) => {
                    const updatedCategories = product.categories.filter(
                        cat => cat !== categoryName,
                    );
                    await productsCollection.updateDocumentField(
                        product.id,
                        'categories',
                        updatedCategories,
                    );
                }),
            );

            // Encontrar e deletar o documento da categoria
            const allCategories = await categoriesCollection.getAllDocuments();
            const categoryDoc = allCategories.find(
                cat => cat.categoryName === categoryName,
            );

            if (categoryDoc) {
                await categoriesCollection.deleteDocument(categoryDoc.id);
            }

            // Atualizar a lista de categorias
            await fetchCategories();
        } catch (err) {
            console.error('Erro ao deletar categoria:', err);
            throw new Error('Erro ao deletar categoria');
        }
    }, [categoriesCollection, productsCollection, getProductsByCategory, fetchCategories]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        isLoading,
        error,
        deleteCategory,
        getProductsByCategory,
        refreshCategories: fetchCategories,
    };
};
