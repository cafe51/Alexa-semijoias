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
import AssocietedProductsSection from './AssocietedProductsSection';
import RecomendedProductsSection from './RecomendedProductsSection';
import SiteSectionSection from './SiteSectionSection/SiteSectionSection';
import { useCollection } from '@/app/hooks/useCollection';
import { FullProductType } from '@/app/utils/types';

export default function NewProductPage() {
    const { addDocument } = useCollection<FullProductType>('products');
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
            />

            <SiteSectionSection state={ state } handleAddSection={ handleAddSection }/>

            <AssocietedProductsSection />
            <RecomendedProductsSection />

            <LargeButton color='blue'
                loadingButton={ false }
                onClick={ () => {
                    // console.log(state);
                    const { barcode, sku, stockQuantity, dimensions } = state;

                    const newProduct = {
                        ...state,
                        barcode: (barcode && (barcode.length > 0)) ? barcode : undefined,
                        sku: (sku && (sku.length > 0)) ? sku : undefined,
                        stockQuantity: stockQuantity ? stockQuantity : undefined,
                        dimensions: (dimensions && (Object.values(dimensions).every((v) => v))) ? dimensions : undefined,
                    };

                    for (const property of Object.keys(newProduct)) {
                        if(newProduct[ property as keyof typeof newProduct] === undefined) {
                            delete newProduct[property as keyof typeof newProduct];
                        }
                    }

                    console.log(newProduct);

                    addDocument(newProduct);
                } }
            >
            mostrar estado
            </LargeButton>
        </main>
    );
}
