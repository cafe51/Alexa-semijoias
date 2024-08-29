
import { useNewProductState } from '@/app/hooks/useNewProductState';
import NameAndDescriptionSection from './novo/NameAndDescriptionSection';
import { CategoryType, FireBaseDocument, ProductBundleType, StateNewProductType, UseProductDataHandlers } from '@/app/utils/types';
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
import { productIdGenerator } from '@/app/utils/productIdGenerator';

interface ProductEditionFormProps {
    product?:  StateNewProductType,
    useProductDataHandlers: UseProductDataHandlers;
    productFromFirebase?: ProductBundleType & FireBaseDocument;
}

export default function ProductEditionForm({ product, useProductDataHandlers, productFromFirebase }: ProductEditionFormProps) {
    const { state, handlers } = useNewProductState(product);
    const { addDocument: createNewProductDocument } = useCollection<ProductBundleType>('products');
    const { addDocument: createNewCategoryDocument } = useCollection<CategoryType>('categories');

    const handleCreateNewProductClick = async() => {
        try {
            const allImagesUrls = await useProductDataHandlers.uploadAndGetAllImagesUrl(state.images);

            if(state && state.categories && state.categories.length > 0) {
                for(const category of state.categories) {
                    createNewCategoryDocument({ categoryName: category });
                }
            }

            await useProductDataHandlers.createAndUpdateSiteSections(state.sectionsSite);
        
            const productId = productIdGenerator(productFromFirebase, state.barcode, state.productVariations[0].defaultProperties.barcode);

            if(state.productVariations && state.productVariations.length > 0 && state.subsections) {
                const newProduct = useProductDataHandlers.hasProductVariations(state, allImagesUrls, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
            }

            if(!state.productVariations || state.productVariations.length === 0) {
                const newProduct = useProductDataHandlers.hasNoProductVariations(state, allImagesUrls, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                handlers.handleVariationsChange([]);
            }
        } catch(error) {
            console.error(error);
        }

    };

    return (
        <section className='flex flex-col gap-2 w-full'>
            <h1 className='font-bold'>{ product ? 'Editar Produto': 'Novo Produto' }</h1>
            <NameAndDescriptionSection state={ state } handlers={ handlers } />
            <PhotosSection state={ state } handleSetImages={ handlers.handleSetImages } />
            <PricesSection state={ state } handleValueChange={ handlers.handleValueChange } />
            <SiteSectionSection state={ state }  handlers={ handlers } />
            <CategoriesSection state={ state } handlers={ handlers } />
            <VariationsSection state={ state } handlers={ handlers } />
            { 
                (!state.productVariations || state.productVariations.length == 0) &&
                <>
                    <StockSection state={ state } handlers={ handlers } />
                    <DimensionsSection state={ state } handlers={ handlers } />
                    <CodesSection
                        barCode={ state.barcode }
                        sections={ state.sections }
                        sku={ state.sku }
                        handleBarcodeChange={ handlers.handleBarcodeChange }
                        handleSkuChange={ handlers.handleSkuChange }
                    />
                </>
            }
            { /* <AssociatedProductsSection />
            <RecommendedProductsSection /> */ }
            <LargeButton color='blue' loadingButton={ false } onClick={ handleCreateNewProductClick }>
            Criar Produto
            </LargeButton>
            <LargeButton color='green' loadingButton={ false } onClick={ () => { console.log(state); } }>
                Mostrar estado
            </LargeButton>
        </section>
    );
}