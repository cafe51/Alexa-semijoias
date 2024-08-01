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
import CategoriesSection from './CategoriesSection';
import VariationsSection from './VariationSection/VariationsSection';
import { useState } from 'react';

export default function NewProductPage() {
    const [showVariationEditionModal, setShowVariationEditionModal] = useState(false);


    const {
        state,
        handleNameChange,
        handleDescriptionChange,
        handleValueChange,
        handleStockQuantityChange,
        handleVariationsChange,
        handleStockTypeChange,
        handleBarcodeChange,
        handleSkuChange,
        handleDimensionsChange,
        handleAddProductVariation,
        handleRemoveProductVariation,
        handleUpdateProductVariation,
        handleAddNewVariationInAllProductVariations,
        handleRemoveVariationInAllProductVariations,
        handleClearProductVariations,
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

            <StockSection
                state={ state }
                handleStockQuantityChange={ handleStockQuantityChange }
                handleStockTypeChange={ handleStockTypeChange }
            />

            <CodesSection
                state={ state }
                handleBarcodeChange={ handleBarcodeChange }
                handleSkuChange={ handleSkuChange }
            />

            <DimensionsSection
                state={ state }
                handleDimensionsChange={ handleDimensionsChange }
            />

            <CategoriesSection />

            <VariationsSection
                state={ state }
                setShowVariationEditionModal={ setShowVariationEditionModal }
                showVariationEditionModal={ showVariationEditionModal }
                handleVariationsChange={ handleVariationsChange }
                handleAddProductVariation={ handleAddProductVariation }
                handleRemoveProductVariation={ handleRemoveProductVariation }
                handleUpdateProductVariation={ handleUpdateProductVariation }
                handleAddNewVariationInAllProductVariations={ handleAddNewVariationInAllProductVariations }
                handleRemoveVariationInAllProductVariations={ handleRemoveVariationInAllProductVariations }
                handleClearProductVariations={ handleClearProductVariations }
            />

            <LargeButton color='blue'
                loadingButton={ false }
                onClick={ () => {
                    console.log(state);
                } }
            >
            mostrar estado
            </LargeButton>
        </main>
    );
}
