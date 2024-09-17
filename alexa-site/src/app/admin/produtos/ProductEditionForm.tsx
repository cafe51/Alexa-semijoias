import { useNewProductState } from '@/app/hooks/useNewProductState';
import { FireBaseDocument, ProductBundleType, StateNewProductType, UseProductDataHandlers } from '@/app/utils/types';
import LargeButton from '@/app/components/LargeButton';
import { useCollection } from '@/app/hooks/useCollection';
import { productIdGenerator } from '@/app/utils/productIdGenerator';
import NameAndDescriptionSection from './novo/NameAndDescriptionSection';
import PhotosSection from './novo/PhotoSection/PhotosSection';
import PricesSection from './novo/PricesSection';
import SiteSectionSection from './novo/SiteSectionSection/SiteSectionSection';
import CategoriesSection from './novo/CategoriesSection.tsx/CategoriesSection';
import VariationsSection from './novo/VariationSection/VariationsSection';
import StockSection from './novo/StockSection';
import DimensionsSection from './novo/DimensionsSection';
import CodesSection from './novo/CodesSection';
import MoreOptionsSection from './novo/MoreOptionsSection';

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

    const handleCreateNewProductClick = async() => {
        try {
            const allImagesUrls = await useProductDataHandlers.uploadAndGetAllImagesUrl(state.images);

            await useProductDataHandlers.createOrUpdateCategories(state.categories);

            await useProductDataHandlers.createAndUpdateSiteSections(state.sectionsSite);
        
            const productId = productIdGenerator(productFromFirebase, state.barcode, state.productVariations[0]?.defaultProperties?.barCode);

            if(state.productVariations && state.productVariations.length > 0) {
                const newProduct = useProductDataHandlers.hasProductVariations(state, allImagesUrls, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                console.log('id do novo produto criado:', productId);
                await useProductDataHandlers.createOrUpdateProductVariations(productId, newProduct.productVariations);
                setRefreshProducts && setRefreshProducts();
            }

            if(!state.productVariations || state.productVariations.length === 0) {
                const newProduct = useProductDataHandlers.hasNoProductVariations(state, allImagesUrls, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                handlers.handleVariationsChange([]);
                setRefreshProducts && setRefreshProducts();
                await useProductDataHandlers.createOrUpdateProductVariations(productId, newProduct.productVariations);

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