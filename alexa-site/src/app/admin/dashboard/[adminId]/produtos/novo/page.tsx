// app/admin/dashboard/[adminId]/produtos/novo/page.tsx
'use client';
import { useNewProductState } from '@/app/hooks/useNewProductState';
import LargeButton from '@/app/components/LargeButton';
import NameAndDescriptionSection from './NameAndDescriptionSection';
import PhotosSection from './PhotoSection/PhotosSection';
import PricesSection from './PricesSection';
import StockSection from './StockSection';
import CodesSection from './CodesSection';
import DimensionsSection from './DimensionsSection';
import CategoriesSection from './CategorieSection.tsx/CategoriesSection';
import VariationsSection from './VariationSection/VariationsSection';
// import AssociatedProductsSection from './AssociatedProductsSection';
// import RecommendedProductsSection from './RecommendedProductsSection';
import SiteSectionSection from './SiteSectionSection/SiteSectionSection';
import { useCollection } from '@/app/hooks/useCollection';
import { CategoryType, CheckboxData, ProductBundleType, SectionType } from '@/app/utils/types';
import useFirebaseUpload from '@/app/hooks/useFirebaseUpload';
import { useEffect, useState } from 'react';
import { DocumentData, WithFieldValue } from 'firebase/firestore';

export default function NewProductPage() {
    const { uploadImages } = useFirebaseUpload();
    const { addDocument } = useCollection<ProductBundleType>('products');
    const { getAllDocuments, addDocument: createNewCategoryDocument } = useCollection<CategoryType>('categories');
    const {
        addDocument: createNewSiteSectionDocument,
        updateDocumentField: updateSiteSectionDocumentField,
        getDocumentById: getSiteSectionDocumentById,
    } = useCollection<SectionType>('siteSections');

    const [categoriesStateFromFirebase, setCategoriesStateFromFirebase] = useState<(CategoryType & WithFieldValue<DocumentData>)[] | never[]>([]);
    const [options, setOptions] = useState<CheckboxData[]>([]);

    const {
        state, handleNameChange, handleDescriptionChange, handleValueChange,
        handleStockQuantityChange, handleVariationsChange, handleBarcodeChange,
        handleSkuChange, handleDimensionsChange, handleAddProductVariation,
        handleRemoveProductVariation, handleUpdateProductVariation, handleAddNewVariationInAllProductVariations,
        handleRemoveVariationInAllProductVariations, handleClearProductVariations,
        handleAddSection,
        handleAddCategories,
        handleRemoveAllCategories,
        handleRemoveCategory,
        handleAddSubSection,
        handleAddSectionsSite,
        handleSetImages,
        handleSetCategoriesFromFb,
    } = useNewProductState();

    useEffect(() => {
        async function getCategoriesFromFirebase() {
            const res = await getAllDocuments();
            console.log('categorias', res);
            setCategoriesStateFromFirebase(res);
        }
        getCategoriesFromFirebase();
    }, []);

    useEffect(() => {
        const initialOptions = categoriesStateFromFirebase
            .map((c) => c.categoryName)
            .map((label) => ({ label, isChecked: false }));
        setOptions(initialOptions);
    }, [categoriesStateFromFirebase]);

    return (
        <main className='flex flex-col gap-2 w-full'>
            <h1 className='font-bold'>Novo Produto</h1>
            <NameAndDescriptionSection
                state={ state }
                handleNameChange={ handleNameChange }
                handleDescriptionChange={ handleDescriptionChange }
            />
            <PhotosSection
                state={ state }
                handleSetImages={ handleSetImages }
            />

            <PricesSection
                state={ state }
                handleValueChange={ handleValueChange }
            />

            <CodesSection
                state={ state }
                handleBarcodeChange={ handleBarcodeChange }
                handleSkuChange={ handleSkuChange }
            />

            <CategoriesSection
                state={ state }
                options={ options }
                setOptions={ setOptions }
                handleAddCategories={ handleAddCategories }
                handleRemoveAllCategories={ handleRemoveAllCategories }
                handleRemoveCategory={ handleRemoveCategory }
                handleSetCategoriesFromFb={ handleSetCategoriesFromFb }
            />

            { 
                (!state.productVariations || state.productVariations.length == 0) &&
                <>
                    <StockSection
                        state={ state }
                        handleStockQuantityChange={ handleStockQuantityChange }
                    />
                    <DimensionsSection
                        state={ state }
                        handleDimensionsChange={ handleDimensionsChange }
                    />
                </>
            }

            <VariationsSection
                state={ state }
                handleVariationsChange={ handleVariationsChange }
                handleAddProductVariation={ handleAddProductVariation }
                handleRemoveProductVariation={ handleRemoveProductVariation }
                handleUpdateProductVariation={ handleUpdateProductVariation }
                handleAddNewVariationInAllProductVariations={ handleAddNewVariationInAllProductVariations }
                handleRemoveVariationInAllProductVariations={ handleRemoveVariationInAllProductVariations }
                handleClearProductVariations={ handleClearProductVariations }
                handleStockQuantityChange={ handleStockQuantityChange }
            />

            <SiteSectionSection
                state={ state }
                handleAddSectionsSite={ handleAddSectionsSite }
                handleAddSection={ handleAddSection }
                handleAddSubSection={ handleAddSubSection }
            />

            { /* <AssociatedProductsSection />
            <RecommendedProductsSection /> */ }

            <LargeButton color='blue'
                loadingButton={ false }
                onClick={ async() => {
                    const imageUrls = await uploadImages(state.images.map((image) => image.file));
                    if(state && state.categories && state.categories.length > 0) {
                        for(const category of state.categories) {
                            createNewCategoryDocument({ categoryName: category });
                        }
                    }
                    let newProduct: ProductBundleType;
                    const productId = '78902166' + (Math.floor(Math.random() * 9000) + 1000).toString();

                    if(state.sectionsSite && state.sectionsSite.length > 0) {
                        for(const siteSection of state.sectionsSite) {
                            if(siteSection.exist && siteSection.id) { // caso a siteSection contenha exist e id (exista no firebase)
                                if(siteSection.subsections) { // caso o siteSection possua subsections
                                    const siteSectionDocument = await getSiteSectionDocumentById(siteSection.id); // procura o siteSection equivalente no firebase
                                    if(siteSectionDocument.exist) { // caso seja achado o siteSection equivalente no firebase
                                        if(siteSectionDocument.subsections) { // caso o siteSection do firebase possua subsections
                                            const subSectionsSet = new Set(siteSectionDocument.subsections);
                                            siteSection.subsections.forEach((ss) => subSectionsSet.add(ss)); // add todas as subsections exceto as repetidas
                                            const subSectionsUpdated = Array.from(subSectionsSet);
                                            updateSiteSectionDocumentField(siteSection.id, 'subsections', subSectionsUpdated);
                                        } else { // caso o siteSection do firebase não possua subsections
                                            updateSiteSectionDocumentField(siteSection.id, 'subsections', siteSection.subsections);
                                        }
                                    }
                                }
                            } else { // caso a siteSection não contenha exist (não exista no firebase)
                                createNewSiteSectionDocument(siteSection);
                            }
                        }
                    }

                    if(state.productVariations && state.productVariations.length > 0 && state.subsections) {
                        let totalStock = 0;

                        for (const pv of state.productVariations) {
                            totalStock += pv.defaultProperties.estoque;
                        }

                        newProduct = {
                            name: state.name,
                            images: imageUrls,
                            description: state.description,
                            categories: [...state.categories, ...state.categoriesFromFirebase],
                            value: state.value,
                            sections: state.sections,
                            subsections: state.subsections, // do tipo 'sectionName:subsectionName'[]
                            variations: state.variations,
                            estoqueTotal: totalStock,
                            // images= state.images.map((image) => image.file),
    
                            productVariations: state.productVariations.map((pv, index) => {

                                // [{cor: amarelo, tamanho: 14}, {cor: amarelo, tamanho: 16}, {cor: verde, tamanho: 14}]
                                // [coramtam14, coramtam16, corvertam14]
                                const sectionsClone = [...state.sections];
                                const sectionNamesForSku = sectionsClone.map((section) => section.slice(0,3)).join('');

                                let skuString = sectionNamesForSku;
                                for (const property in pv.customProperties) {
                                    skuString += property.slice(0, 3) + pv.customProperties[property].slice(0, 3);
                                }

                                const numeroAleatorio = (Math.floor(Math.random() * 9000) + 1000).toString();
                                const codigoDeBarra = (state.barcode && state.barcode.length > 0) ? state.barcode : '78902166' + numeroAleatorio + index.toString();

                                const skuGenerated = state.sku ? state.sku + index.toString() : (skuString + 'cb' + codigoDeBarra);


                                return {

                                    customProperties: { ...pv.customProperties },
                                    ...pv.defaultProperties,
                                    image: imageUrls[pv.defaultProperties.imageIndex],
                                    productId,
                                    name: state.name,
                                    value: state.value,

                                    sku: skuGenerated,
                                    barcode: codigoDeBarra,

                                };
                            }),
                        };
                        await addDocument(newProduct, productId);
                    }

                    if(!state.productVariations || state.productVariations.length === 0) {
                        const sectionsClone = [...state.sections];
                        const sectionNamesForSku = sectionsClone.map((section) => section.slice(0,3)).join('');
                        const skuString = sectionNamesForSku;

                        const numeroAleatorio = (Math.floor(Math.random() * 9000) + 1000).toString();
                        const codigoDeBarra = (state.barcode && state.barcode.length > 0) ? state.barcode : '78902166' + numeroAleatorio + '1';

                        const skuGenerated = state.sku ? state.sku : (skuString + 'cb' + codigoDeBarra);

                        newProduct = {
                            name: state.name,
                            images: imageUrls,
                            description: state.description,
                            categories: [...state.categories, ...state.categoriesFromFirebase],
                            value: state.value,
                            sections: state.sections,
                            estoqueTotal: state.estoque ? state.estoque : 0,
                            productVariations: [
                                {   productId,
                                    image: imageUrls && imageUrls[0] ? imageUrls[0] : '',
                                    estoque: state.estoque ? state.estoque : 0,
                                    peso: state.dimensions && state.dimensions.peso ? state.dimensions.peso : 0,
                                    name: state.name,
                                    value: state.value,
                                    dimensions: state.dimensions
                                        ? {
                                            largura: state.dimensions.largura,
                                            altura: state.dimensions.altura,
                                            comprimento: state.dimensions.comprimento,
                                        } : {
                                            largura: 0,
                                            altura: 0,
                                            comprimento: 0,
                                        },
                                    sku: skuGenerated,
                                    barcode: codigoDeBarra,
                                },
                            ],
                        };
                        
                        await addDocument(newProduct, productId);

                        handleVariationsChange([]);
                    }
                    

                } }
            >
            Criar Produto
            </LargeButton>
            <LargeButton color='green'
                loadingButton={ false }
                onClick={ () => {
                    console.log(state);
                } }>
                Mostrar estado
            </LargeButton>
        </main>
    );
}
