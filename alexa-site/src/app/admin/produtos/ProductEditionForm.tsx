import { lazy } from 'react';
import { useNewProductState } from '@/app/hooks/useNewProductState';
import { CategoryType, FireBaseDocument, ProductBundleType, StateNewProductType, UseProductDataHandlers } from '@/app/utils/types';
import LargeButton from '@/app/components/LargeButton';
import { useCollection } from '@/app/hooks/useCollection';
import { productIdGenerator } from '@/app/utils/productIdGenerator';

const NameAndDescriptionSection = lazy(() => import('./novo/NameAndDescriptionSection'));
const PhotosSection = lazy(() => import('./novo/PhotoSection/PhotosSection'));
const PricesSection = lazy(() => import('./novo/PricesSection'));
const CodesSection = lazy(() => import('./novo/CodesSection'));
const CategoriesSection = lazy(() => import('./novo/CategorieSection.tsx/CategoriesSection'));
const StockSection = lazy(() => import('./novo/StockSection'));
const DimensionsSection = lazy(() => import('./novo/DimensionsSection'));
const VariationsSection = lazy(() => import('./novo/VariationSection/VariationsSection'));
const SiteSectionSection = lazy(() => import('./novo/SiteSectionSection/SiteSectionSection'));
const MoreOptionsSection = lazy(() => import('./novo/MoreOpionsSection'));

interface ProductEditionFormProps {
    product?:  StateNewProductType,
    useProductDataHandlers: UseProductDataHandlers;
    productFromFirebase?: ProductBundleType & FireBaseDocument;
    setRefreshProducts?: () => void;
}

export default function ProductEditionForm({
    product,
    useProductDataHandlers,
    productFromFirebase,
    setRefreshProducts,
}: ProductEditionFormProps) {
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
        
            const productId = productIdGenerator(productFromFirebase, state.barcode, state.productVariations[0]?.defaultProperties?.barCode);

            if(state.productVariations && state.productVariations.length > 0) {
                const newProduct = useProductDataHandlers.hasProductVariations(state, allImagesUrls, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                console.log('id do novo produto criado:', productId);
                setRefreshProducts && setRefreshProducts();
            }

            if(!state.productVariations || state.productVariations.length === 0) {
                const newProduct = useProductDataHandlers.hasNoProductVariations(state, allImagesUrls, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                handlers.handleVariationsChange([]);
                setRefreshProducts && setRefreshProducts();
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
            <MoreOptionsSection state={ state } handlers={ handlers }/>
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