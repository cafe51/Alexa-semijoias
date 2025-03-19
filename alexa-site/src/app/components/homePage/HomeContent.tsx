// src/app/components/homePage/HomeContent.tsx

import { FireBaseDocument, ProductBundleType, SectionType } from '@/app/utils/types';
import HeroSection from './HeroSection';
import InfoBanner from './InfoBanner';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { projectFirestoreDataBase } from '@/app/firebase/config';
import { fetchRandomProductForSection, ProductsResponse } from '@/app/services/products';
import { serializeData } from '@/app/utils/serializeData';
import { SITE_URL } from '@/app/utils/constants';
import DiscoverOurProducts from './DiscoverOurProducts/DiscoverOurProducts';
import DualTitlesSection from './DualTitlesSection';
import PromoBanner from './PromoBanner';
import Sections from './Sections/Sections';
import SectionsMobileCarousel from './Sections/SectionsMobileCarousel';


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
) {
    const randomProducts = await Promise.all(
        sections.map(async(section) => {
            const product = await fetchRandomProductForSection(section.sectionName);
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


  
// Cache (revalidate) – os dados serão revalidado a cada 60 segundos
export const revalidate = 60;
  
export default async function HomeContent() {
    // Busca último produto adicionado
    const lastAddProduct = await getLastProductAdded();

    // Busca as seções primeiro
    const sections = await getSections();
  
    // Busca os produtos aleatórios para cada seção (para o carousel)
    const randomProductsForSections = await getRandomProductsForSections(sections);
  
    // Busca os produtos em destaque (para outra parte da página)
    const featuredProducts = await getFeaturedProducts(sections);

    // const OPTIONS: EmblaOptionsType = { align: 'start', dragFree: false, loop: true };
    // const SLIDE_COUNT = 5;
    // const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

    function filtrarResultadosValidos<T>(array: (T | null | false | undefined)[]): T[] {
        return array.filter((item): item is T => {
            return item !== null && item !== false && item !== undefined;
        });
    }

    const sectionsToDiscover = ['aneis', 'pulseiras', 'colares', 'conjuntos', 'brincos', 'pingentes', 'tornozeleiras' ];
    const productsToDiscover = filtrarResultadosValidos<ProductBundleType & FireBaseDocument>([...featuredProducts, ...randomProductsForSections.map(({ product }) => product)]);

    // const sectionCardDataGenerator = (urlImage: string, sectionName: string) => {
    //     return {
    //         urlImage,
    //         sectionName,
    //     };
    // };

    // const arrayOfFourProducts = [
    //     sectionCardDataGenerator(getImageUrlFromFirebaseProductDocument(randomProductsForSections[0].product), randomProductsForSections[0].section),
    //     sectionCardDataGenerator(getImageUrlFromFirebaseProductDocument(randomProductsForSections[1].product), randomProductsForSections[1].section),
    //     sectionCardDataGenerator(getImageUrlFromFirebaseProductDocument(randomProductsForSections[2].product), randomProductsForSections[2].section),
    //     sectionCardDataGenerator(getImageUrlFromFirebaseProductDocument(featuredProducts[0]), featuredProducts[0].sections[0]),
    // ];

    const arrayOfFourProducts = filtrarResultadosValidos([
        randomProductsForSections[0].product,
        randomProductsForSections[1].product,
        randomProductsForSections[2].product,

        featuredProducts[0],
        featuredProducts[1],

    ]);

  
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <HeroSection lastAddProduct={ lastAddProduct } />
            <DiscoverOurProducts products={ productsToDiscover } sections={ sectionsToDiscover } />
            <DualTitlesSection products={ [ featuredProducts[0], featuredProducts[featuredProducts.length - 1] ] } />
            <InfoBanner />
            <SectionsMobileCarousel products={ arrayOfFourProducts } />
            <Sections products={ arrayOfFourProducts } />
            <PromoBanner />

        </div>
    );
}