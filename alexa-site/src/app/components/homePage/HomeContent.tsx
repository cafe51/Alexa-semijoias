// src/app/components/homePage/HomeContent.tsx
import { FireBaseDocument, ProductBundleType } from '@/app/utils/types';
import InfoBanner from './InfoBanner';
import DiscoverOurProducts from './DiscoverOurProducts/DiscoverOurProducts';
import DualTitlesSection from './DualTitlesSection';
import PromoBanner from './PromoBanner';
import Sections from './Sections/Sections';
import SectionsMobileCarousel from './Sections/SectionsMobileCarousel';
import {
    getSections,
    getRandomProductsForSections,
    getLastProductAdded,
    getTwoRandomSections,
    getRandomProductsForDualTitlesSection,
    filtrarResultadosValidos,
    getBanners,
} from './homePageUtilFunctions';
  
import { fetchDiscoverProductsForSection } from '@/app/services/discoverProducts';
import HeroCarousel from './banners/HeroCarousel';

// Cache (revalidate) – os dados serão revalidado a cada 60 segundos
export const revalidate = 60;
  
export default async function HomeContent() {
    const banners = await getBanners();

    // Busca último produto adicionado
    const lastAddProduct = await getLastProductAdded();

    // Busca as seções primeiro
    const sections = await getSections();

    const exclusionMapForCarousel: { [sectionName: string]: string[] } = {};
    if (lastAddProduct && lastAddProduct.sections) {
        lastAddProduct.sections.forEach((sec) => {
            exclusionMapForCarousel[sec] = exclusionMapForCarousel[sec]
                ? [...exclusionMapForCarousel[sec], lastAddProduct.id]
                : [lastAddProduct.id];
        });
    }
  
    // Busca os produtos aleatórios para cada seção (para o carousel)
    const randomProductsForSections = sections && sections.length > 0 
        ? await getRandomProductsForSections(sections, exclusionMapForCarousel)
        : [];

    // Seleciona duas seções para o dual titles
    const dualSections = sections && sections.length > 0 ? getTwoRandomSections(sections) : [];
    
    // Cria o mapa de exclusão para dual titles
    const exclusionMapForDual: { [sectionName: string]: string[] } = {};
    dualSections.forEach((section) => {
        const ids: string[] = [];
        // Se o lastAddProduct pertence à seção
        if (lastAddProduct && lastAddProduct.sections?.includes(section.sectionName)) {
            ids.push(lastAddProduct.id);
        }
        // Se já há um produto no carousel para essa seção, adiciona seu id
        const matching = randomProductsForSections.find((rp) => rp.section === section.sectionName);
        if (matching && matching.product && matching.product.id) {
            ids.push(matching.product.id);
        }
        if (ids.length > 0) {
            exclusionMapForDual[section.sectionName] = ids;
        }
    });

    const randomProductsForDualTitlesSection = dualSections && dualSections.length > 0
        ? await getRandomProductsForDualTitlesSection(dualSections, exclusionMapForDual)
        : [];
  


    // Monta o mapa de exclusão para cada seção (para Discover), considerando os produtos já requisitados
    const exclusionMapForDiscover: { [sectionName: string]: string[] } = {};
    sections.forEach((section) => {
        const ids: string[] = [];
        if (lastAddProduct && lastAddProduct.sections?.includes(section.sectionName)) {
            ids.push(lastAddProduct.id);
        }
        const rp = randomProductsForSections.find((rp) => rp.section === section.sectionName);
        if (rp && rp.product && rp.product.id) {
            ids.push(rp.product.id);
        }
        const dual = randomProductsForDualTitlesSection.find((rp) => rp.section === section.sectionName);
        if (dual && dual.product && dual.product.id) {
            ids.push(dual.product.id);
        }
        exclusionMapForDiscover[section.sectionName] = ids;
    });

    // Busca, para cada seção, até 6 produtos aleatórios (descartando os já usados, se possível)
    const discoverPromises = sections.map(async(section) => {
        const products = await fetchDiscoverProductsForSection(
            section.sectionName,
            exclusionMapForDiscover[section.sectionName] || [],
        );
        return { section: section.sectionName, products };
    });

    const discoverProductsBySection = await Promise.all(discoverPromises);
    // Remove seções que não retornaram nenhum produto
    const validDiscoverProducts = discoverProductsBySection.filter(
        (item) => item.products.length > 0,
    );
    // Agrupa todos os produtos em um único array (cada produto já tem a propriedade section anexada)
    const discoverProducts = validDiscoverProducts.flatMap((item) => item.products);
    // Define as seções (para os botões) apenas das seções com produtos
    const discoverSections = validDiscoverProducts.map((item) => item.section);

    const sectionProducts = filtrarResultadosValidos<ProductBundleType & FireBaseDocument>(randomProductsForSections.map(({ product }) => product));

    const dualTitlesProducts = filtrarResultadosValidos<ProductBundleType & FireBaseDocument>(randomProductsForDualTitlesSection.map(({ product }) => product));
  
    return (
        <div className="bg-[#FAF9F6] text-[#333333] min-h-screen w-full">
            <HeroCarousel lastAddProduct={ lastAddProduct } banners={ banners } />
            { discoverProducts && discoverProducts.length > 0 && (
                <DiscoverOurProducts products={ discoverProducts } sections={ discoverSections } />
            ) }
            { dualTitlesProducts && dualTitlesProducts.length > 0 && <DualTitlesSection products={ dualTitlesProducts } /> }
            <InfoBanner />
            { sectionProducts && sectionProducts.length > 0 && <SectionsMobileCarousel products={ sectionProducts } homePage /> }{ /* só aparece em mobile */ }
            { sectionProducts && sectionProducts.length > 0 && <Sections products={ sectionProducts } homePage /> }{ /* só aparece em desktop */ }
            <PromoBanner />
        </div>
    );
}