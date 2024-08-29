
import { useNewProductState } from '@/app/hooks/useNewProductState';
import NameAndDescriptionSection from './novo/NameAndDescriptionSection';
import { CategoryType, FireBaseDocument, ProductBundleType, SectionType, StateNewProductType } from '@/app/utils/types';
import PhotosSection from './novo/PhotoSection/PhotosSection';
import PricesSection from './novo/PricesSection';
import CodesSection from './novo/CodesSection';
import CategoriesSection from './novo/CategorieSection.tsx/CategoriesSection';
import StockSection from './novo/StockSection';
import DimensionsSection from './novo/DimensionsSection';
import VariationsSection from './novo/VariationSection/VariationsSection';
import SiteSectionSection from './novo/SiteSectionSection/SiteSectionSection';
import LargeButton from '@/app/components/LargeButton';
import { useCollection } from '@/app/hooks/useCollection';

interface ProductEditionFormProps {
    product?:  StateNewProductType,
    useProductDataHandlers: {
        hasNoProductVariations: (editableProduct: StateNewProductType, imageUrls: string[], productId: string) => ProductBundleType;
        hasProductVariations: (editableProduct: StateNewProductType, imageUrls: string[], productId: string) => ProductBundleType;
        uploadAndGetAllImagesUrl: (images: {
            file?: File;
            localUrl: string;
        }[]) => Promise<string[]>;
        createAndUpdateSiteSections: (sectionsSiteState: never[] | (SectionType & {
            exist?: boolean;
            id?: string;
        })[]) => Promise<void>;
    }
    productFromFirebase?: ProductBundleType & FireBaseDocument;
}

export default function ProductEditionForm({ product, useProductDataHandlers, productFromFirebase }: ProductEditionFormProps) {
    const { state, handlers } = useNewProductState(product);
    const { addDocument: createNewProductDocument } = useCollection<ProductBundleType>('products');
    const { addDocument: createNewCategoryDocument } = useCollection<CategoryType>('categories');

    const handleCreateNewProductClick = async() => {
        console.log(state);

        const allImagesUrls = await useProductDataHandlers.uploadAndGetAllImagesUrl(state.images);

        if(state && state.categories && state.categories.length > 0) {
            for(const category of state.categories) {
                createNewCategoryDocument({ categoryName: category });
            }
        }

        await useProductDataHandlers.createAndUpdateSiteSections(state.sectionsSite);
        
        // definindo productId
        let productId: string;
        if(productFromFirebase && productFromFirebase.exist && productFromFirebase.id) {
            productId = productFromFirebase.id;
        } else {
            if(state.barcode && state.barcode.length > 1) {
                productId = state.barcode;
            } else {
                if(state.productVariations[0].defaultProperties.barcode) {
                    productId = state.productVariations[0].defaultProperties.barcode;
                } else {
                    productId = '78902166' + (Math.floor(Math.random() * 9000) + 1000).toString();
                }
            }
        }

        // const productId = state.barcode && state.barcode.length > 1 ? state.barcode : '78902166' + (Math.floor(Math.random() * 9000) + 1000).toString();

        if(state.productVariations && state.productVariations.length > 0 && state.subsections) {
            const newProduct = useProductDataHandlers.hasProductVariations(state, allImagesUrls, productId);
            await createNewProductDocument(newProduct, productId);
        }

        if(!state.productVariations || state.productVariations.length === 0) {
            const newProduct = useProductDataHandlers.hasNoProductVariations(state, allImagesUrls, productId);
            await createNewProductDocument(newProduct, productId);
            handlers.handleVariationsChange([]);
        }

    };

    return (
        <section className='flex flex-col gap-2 w-full'>
            <h1 className='font-bold'>{ product ? 'Editar Produto': 'Novo Produto' }</h1>
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

            <SiteSectionSection
                state={ state }
                handleAddSectionsSite={ handlers.handleAddSectionsSite }
                handleAddSection={ handlers.handleAddSection }
                handleAddSubSection={ handlers.handleAddSubSection }
            />

            <CategoriesSection
                state={ state }
                handleAddCategories={ handlers.handleAddCategories }
                handleRemoveAllCategories={ handlers.handleRemoveAllCategories }
                handleRemoveCategory={ handlers.handleRemoveCategory }
                handleSetCategoriesFromFb={ handlers.handleSetCategoriesFromFb }
            />

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

                    <CodesSection
                        state={ state }
                        handleBarcodeChange={ handlers.handleBarcodeChange }
                        handleSkuChange={ handlers.handleSkuChange }
                    />
                </>
            }

            { /* <AssociatedProductsSection />
            <RecommendedProductsSection /> */ }

            <LargeButton color='blue'
                loadingButton={ false }
                onClick={ handleCreateNewProductClick }
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
        </section>
    );
}