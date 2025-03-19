// src/app/components/homePage/homePageUtilFunctions.tsx
import { FireBaseDocument, ProductBundleType, SectionType } from '@/app/utils/types';

import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { fetchRandomProductForSection, ProductsResponse } from '@/app/services/products';
import { serializeData } from '@/app/utils/serializeData';
import { SITE_URL } from '@/app/utils/constants';

// Função para buscar as seções (única chamada)
async function getSections() {
    try {
        const sectionsRef = collection(projectFirestoreDataBase, 'siteSections');
        const sectionsSnapshot = await getDocs(sectionsRef);
        return sectionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...serializeData(doc.data()),
        })) as (SectionType & FireBaseDocument)[];
    } catch (error) {
        console.error('Erro ao buscar seções:', error);
        return [];
    }
}

// Agora a função recebe as seções já carregadas (evitando duplicação)
async function getFeaturedProducts(sectionsData: (SectionType & FireBaseDocument)[]) {
    try {
        const productsPromises = sectionsData.map(async(section) => {
            const productsRef = collection(projectFirestoreDataBase, 'products');
            const q = query(
                productsRef,
                where('estoqueTotal', '>=', 1),
                where('showProduct', '==', true),
                where('sections', 'array-contains', section.sectionName),
                orderBy('creationDate', 'desc'),
                limit(1),
            );
            const productsSnapshot = await getDocs(q);
            const doc = productsSnapshot.docs[0];
            if (!doc) return null;
            return {
                id: doc.id,
                ...serializeData(doc.data()),
            } as (ProductBundleType & FireBaseDocument);
        });
        const products = await Promise.all(productsPromises);
        return products.filter((product): product is ProductBundleType & FireBaseDocument => product !== null);
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        return [];
    }
}

// Para cada seção, busca um produto aleatório para o carousel
async function getRandomProductsForSections(
    sections: (SectionType & FireBaseDocument)[],
    exclusionMap?: { [sectionName: string]: string[] },
) {
    const randomProducts = await Promise.all(
        sections.map(async(section) => {
            let excludeIds: string[] = [];
            if (exclusionMap && exclusionMap[section.sectionName]) {
                excludeIds = exclusionMap[section.sectionName];
            }
            const product = await fetchRandomProductForSection(section.sectionName, excludeIds);
            return { section: section.sectionName, product };
        }),
    );
    return randomProducts;
}

async function getLastProductAdded() {
    try {
        const params = new URLSearchParams();
        params.append('orderBy', 'creationDate');
        params.append('direction', 'desc');
        params.append('limit', '1');
        const response = await fetch(`${SITE_URL}/api/products?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Falha ao carregar produtos');
        }
        const data: ProductsResponse = await response.json();
        return data.products[0];
    } catch (error) {
        console.error('Erro ao carregar último produto adicionado:', error);
    }
}

async function getRandomProductsForDualTitlesSection(
    sections: (SectionType & FireBaseDocument)[],
    exclusionMap?: { [sectionName: string]: string[] },
) {
    const randomProducts = await Promise.all(
        sections.map(async(section) => {
            let excludeIds: string[] = [];
            if (exclusionMap && exclusionMap[section.sectionName]) {
                excludeIds = exclusionMap[section.sectionName];
            }
            const product = await fetchRandomProductForSection(section.sectionName, excludeIds);
            return { section: section.sectionName, product };
        }),
    );
    return randomProducts;
}

function getTwoRandomSections(sections: (SectionType & FireBaseDocument)[]): (SectionType & FireBaseDocument)[] {
    if (sections.length === 2) {
        return sections;
    }

    if (sections.length === 1) {
        return [sections[0], sections[0]];
    }
    
    const shuffled = sections.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
}

export {
    getSections,
    getFeaturedProducts,
    getRandomProductsForSections,
    getLastProductAdded,    
    getTwoRandomSections,
    getRandomProductsForDualTitlesSection,
};