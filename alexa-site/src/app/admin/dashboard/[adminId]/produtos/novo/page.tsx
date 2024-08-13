// app/admin/dashboard/[adminId]/produtos/novo/page.tsx
'use client';
import { useNewProductState } from '@/app/hooks/useNewProductState';
import LargeButton from '@/app/components/LargeButton';
import NameAndDescriptionSection from './NameAndDescriptionSection';
import PhotosSection from './PhotosSection';
import PricesSection from './PricesSection';
import StockSection from './StockSection';
import CodesSection from './CodesSection';
import DimensionsSection from './DimensionsSection';
import CategoriesSection from './CategorieSection.tsx/CategoriesSection';
import VariationsSection from './VariationSection/VariationsSection';
import AssociatedProductsSection from './AssociatedProductsSection';
import RecommendedProductsSection from './RecommendedProductsSection';
import SiteSectionSection from './SiteSectionSection/SiteSectionSection';
import { useCollection } from '@/app/hooks/useCollection';
import { ProductBundleType } from '@/app/utils/types';

export default function NewProductPage() {
    const { addDocument } = useCollection<ProductBundleType>('products');
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
    } = useNewProductState();

    return (
        <main className='flex flex-col gap-2 w-full'>
            <NameAndDescriptionSection
                state={ state }
                handleNameChange={ handleNameChange }
                handleDescriptionChange={ handleDescriptionChange }
            />
            <PhotosSection />

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
                handleAddCategories={ handleAddCategories }
                handleRemoveAllCategories={ handleRemoveAllCategories }
                handleRemoveCategory={ handleRemoveCategory }
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

            <AssociatedProductsSection />
            <RecommendedProductsSection />

            <LargeButton color='blue'
                loadingButton={ false }
                onClick={ () => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    // const { barcode, sku, estoque, dimensions, sectionsSite, ...rest } = state;

                    // if(rest.productVariations && rest.productVariations.length > 0) {
                        
                    // }

                    let newProduct: ProductBundleType;

                    if(state.productVariations && state.productVariations.length > 0 && state.subsections) {
                        let totalStock = 0;

                        for (const pv of state.productVariations) {
                            totalStock += pv.defaultProperties.estoque;
                        }
                        newProduct = {
                            name: state.name,
                            description: state.description,
                            categories: state.categories,
                            value: state.value,
                            sections: state.sections,
                            subsections: state.subsections, // do tipo 'sectionName:subsectionName'[]
                            variations: state.variations,
                            estoqueTotal: totalStock,
    
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

                                    name: state.name,
                                    value: state.value,

                                    sku: skuGenerated,
                                    barcode: codigoDeBarra,

                                };
                            }),
                        };
                        addDocument(newProduct);
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
                            description: state.description,
                            categories: state.categories,
                            value: state.value,
                            sections: state.sections,
                            estoqueTotal: state.estoque ? state.estoque : 0,
                            productVariations: [
                                {
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

                        addDocument(newProduct, skuGenerated);
                        handleVariationsChange([]);
                    }

                    // const newProduct = {
                    //     name: state.name,
                    //     description: state.description,
                    //     categories: state.categories,
                    //     value: state.value,
                    //     sections: state.sections,
                    //     subsections: state.subsections, // do tipo 'sectionName:subsectionName'[]
                    //     variations: state.variations,
                    //     estoque: state.estoque,

                    //     sku: state.sku,
                    //     barcode: state.barcode,
                    //     dimensions: state.dimensions,

                    //     productVariations: state.productVariations,
                    // };

                    // const newProduct = {
                    //     ...rest,
                    //     barcode: (barcode && (barcode.length > 0)) ? barcode : undefined,
                    //     sku: (sku && (sku.length > 0)) ? sku : undefined,
                    //     estoque: estoque ? estoque : totalStock,
                    //     dimensions: (dimensions && (Object.values(dimensions).every((v) => v))) ? dimensions : undefined,
                    //     variations: (rest.productVariations && rest.productVariations.length > 0) ? rest.variations : [],
                    // };

                    // for (const property of Object.keys(newProduct)) {
                    //     if(newProduct[ property as keyof typeof newProduct] === undefined) {
                    //         delete newProduct[property as keyof typeof newProduct];
                    //     }
                    // }

                    // console.log(newProduct);

                    // newProduct.sku ? addDocument(newProduct, newProduct.sku) : addDocument(newProduct);
                } }
            >
            mostrar estado
            </LargeButton>
        </main>
    );
}
