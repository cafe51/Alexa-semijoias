
import { useNewProductState } from '@/app/hooks/useNewProductState';
import NameAndDescriptionSection from './novo/NameAndDescriptionSection';
import { StateNewProductType } from '@/app/utils/types';
import PhotosSection from './novo/PhotoSection/PhotosSection';
import PricesSection from './novo/PricesSection';
import CodesSection from './novo/CodesSection';
import CategoriesSection from './novo/CategorieSection.tsx/CategoriesSection';
import StockSection from './novo/StockSection';
import DimensionsSection from './novo/DimensionsSection';
import VariationsSection from './novo/VariationSection/VariationsSection';
import SiteSectionSection from './novo/SiteSectionSection/SiteSectionSection';
import LargeButton from '@/app/components/LargeButton';

export default function DashboardProductEdition({ product }: {product:  StateNewProductType}) {

    const { state, handlers } = useNewProductState(product);

    return (
        <section className='flex flex-col gap-2 w-full'>
            <h1 className='font-bold'>Editar Produto</h1>
            <NameAndDescriptionSection
                state={ state }
                handleNameChange={ handlers.handleNameChange }
                handleDescriptionChange={ handlers.handleDescriptionChange }
            />

            <PhotosSection
                state={ state }
                handleSetImages={ handlers.handleSetImages }
            />

            <PricesSection
                state={ state }
                handleValueChange={ handlers.handleValueChange }
            />

            <CodesSection
                state={ state }
                handleBarcodeChange={ handlers.handleBarcodeChange }
                handleSkuChange={ handlers.handleSkuChange }
            />

            <CategoriesSection
                state={ state }
                handleAddCategories={ handlers.handleAddCategories }
                handleRemoveAllCategories={ handlers.handleRemoveAllCategories }
                handleRemoveCategory={ handlers.handleRemoveCategory }
                handleSetCategoriesFromFb={ handlers.handleSetCategoriesFromFb }
            />

            { 
                (!state.productVariations || state.productVariations.length == 0) &&
                <>
                    <StockSection
                        state={ state }
                        handleStockQuantityChange={ handlers.handleStockQuantityChange }
                    />
                    <DimensionsSection
                        state={ state }
                        handleDimensionsChange={ handlers.handleDimensionsChange }
                    />
                </>
            }

            <VariationsSection
                state={ state }
                handleVariationsChange={ handlers.handleVariationsChange }
                handleAddProductVariation={ handlers.handleAddProductVariation }
                handleRemoveProductVariation={ handlers.handleRemoveProductVariation }
                handleUpdateProductVariation={ handlers.handleUpdateProductVariation }
                handleAddNewVariationInAllProductVariations={ handlers.handleAddNewVariationInAllProductVariations }
                handleRemoveVariationInAllProductVariations={ handlers.handleRemoveVariationInAllProductVariations }
                handleClearProductVariations={ handlers.handleClearProductVariations }
                handleStockQuantityChange={ handlers.handleStockQuantityChange }
            />

            <SiteSectionSection
                state={ state }
                handleAddSectionsSite={ handlers.handleAddSectionsSite }
                handleAddSection={ handlers.handleAddSection }
                handleAddSubSection={ handlers.handleAddSubSection }
            />
            
            <LargeButton color='green'
                loadingButton={ false }
                onClick={ () => {
                    console.log(state);
                } }>
                Mostrar estado
            </LargeButton>
        </section>
    );
}