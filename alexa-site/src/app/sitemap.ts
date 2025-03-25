import { MetadataRoute } from 'next';
import { projectFirestoreDataBase } from './firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { createSlugName } from './utils/createSlugName';
import { CategoryType, CollectionType, ProductBundleType } from './utils/types';

const BASE_URL = 'https://www.alexasemijoias.com.br';

// Função auxiliar para formatar a data
const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const result: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: formatDate(new Date()),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/sobre`,
            lastModified: formatDate(new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/dicas-e-cuidados`,
            lastModified: formatDate(new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/garantia`,
            lastModified: formatDate(new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/politica-de-privacidade`,
            lastModified: formatDate(new Date()),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    try {
        // Buscar produtos ativos
        const productsRef = collection(projectFirestoreDataBase, 'products');
        const productsQuery = query(productsRef, where('showProduct', '==', true));
        const productsSnapshot = await getDocs(productsQuery);

        // Adicionar URLs dos produtos
        productsSnapshot.forEach((doc) => {
            const data = doc.data() as ProductBundleType;
            result.push({
                url: `${BASE_URL}/product/${data.slug}`,
                lastModified: formatDate(data.updatingDate?.toDate() || new Date()),
                changeFrequency: 'daily',
                priority: data.lancamento ? 0.9 : 0.8,

            });

            if(data.subsections && Array.isArray(data.subsections)) {
                data.subsections.forEach(subsection => {
                    result.push({
                        url: `${BASE_URL}/section/${createSlugName(subsection.split(':')[0])}/${createSlugName(subsection.split(':')[1])}/${data.slug}`,
                        lastModified: formatDate(data.updatingDate?.toDate() || new Date()),
                        changeFrequency: 'daily',
                        priority: 0.8,
                    });
                });
            }
        });

        // Buscar seções
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);

        // Adicionar URLs das seções e subseções
        sectionsSnapshot.forEach((doc) => {
            const data = doc.data();
            
            // URL da seção principal
            result.push({
                url: `${BASE_URL}/section/${createSlugName(data.sectionName)}`,
                lastModified: formatDate(new Date()),
                changeFrequency: 'daily',
                priority: 0.8,
            });

            // URLs das subseções
            if (data.subsections && Array.isArray(data.subsections)) {
                data.subsections.forEach(subsection => {
                    result.push({
                        url: `${BASE_URL}/section/${createSlugName(data.sectionName)}/${createSlugName(subsection)}`,
                        lastModified: formatDate(new Date()),
                        changeFrequency: 'daily',
                        priority: 0.7,
                    });
                });
            }
        });

        // Buscar coleções
        const collectionsRef = collection(projectFirestoreDataBase, 'colecoes');
        const collectionsSnapshot = await getDocs(collectionsRef);
 
        // Adicionar URLs das coleções
        collectionsSnapshot.forEach((doc) => {
            const data = doc.data() as CollectionType;
             
            // URL da seção principal
            result.push({
                url: `${BASE_URL}/colecoes/${createSlugName(data.slugName)}`,
                lastModified: formatDate(new Date()),
                changeFrequency: 'daily',
                priority: 0.8,
            });

        });

        // Buscar categorias
        const categoriesRef = collection(projectFirestoreDataBase, 'categories');
        const categoriesSnapshot = await getDocs(categoriesRef);
    
        const allCategoriesForSiteMap = Array.from(new Set(categoriesSnapshot.docs.map((doc) => {
            const data = doc.data() as CategoryType;
            return data.categoryName;
        }).map((categoryName) => {
            const splitedName = categoryName.split(' ');
            return splitedName.map((singleWord) => {
                return createSlugName(singleWord);
            });
        }).flat()));

        allCategoriesForSiteMap.forEach((cat) => {
            // URL
            result.push({
                url: `${BASE_URL}/search/${cat}`,
                lastModified: formatDate(new Date()),
                changeFrequency: 'daily',
                priority: 0.8,
            });


        });

    } catch (error) {
        console.error('Erro ao gerar sitemap:', error);
    }

    return result;
}
