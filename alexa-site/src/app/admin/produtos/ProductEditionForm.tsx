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
import { useState, useRef, useEffect } from 'react';

interface ProductEditionFormProps {
    product?:  StateNewProductType,
    useProductDataHandlers: UseProductDataHandlers;
    productFromFirebase?: ProductBundleType & FireBaseDocument;
    setRefreshProducts?: () => void;
    goToProductPage?: () => void;
}

export default function ProductEditionForm({
    product,
    useProductDataHandlers,
    productFromFirebase,
    setRefreshProducts,
    goToProductPage,
}: ProductEditionFormProps) {
    const { state, handlers } = useNewProductState(product);
    const [ finishFormError, setFinishFormError ] = useState<string | undefined>(undefined);
    const { addDocument: createNewProductDocument } = useCollection<ProductBundleType>('products');
    const [loadingButton, setLoadingButton] = useState<boolean>(false);

    const oldStateRef = useRef<StateNewProductType | null>(null);

    useEffect(() => {
        if (oldStateRef.current === null) {
            oldStateRef.current = state;
        }
    }, []);

    const handleCreateNewProductClick = async() => {
        try {
            setLoadingButton(true);
            const oldState = oldStateRef.current;
            if (!oldState) {
                throw new Error('Estado inicial não foi capturado');
            }
            
            const verifyFields = await useProductDataHandlers.verifyFieldsOnFinishProductCreation(state, oldState, setFinishFormError);

            if(!verifyFields) {
                setLoadingButton(false);
                return;
            }

            const allImagesUrls = await useProductDataHandlers.uploadAndGetAllImagesUrl(
                state.images,
                productFromFirebase?.images, // Passar as imagens antigas do produto
            );

            const orderedImagesByIndex = allImagesUrls.sort((a, b) => a.index - b.index);

            await useProductDataHandlers.createOrUpdateCategories(state.categories);

            await useProductDataHandlers.createAndUpdateSiteSections(state.sectionsSite);
        
            const productId = productIdGenerator(productFromFirebase, state.barcode, state.productVariations[0]?.defaultProperties?.barCode);

            if(state.productVariations && state.productVariations.length > 0) {
                const newProduct = useProductDataHandlers.hasProductVariations(state, orderedImagesByIndex, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                console.log('id do novo produto criado:', productId);
                await useProductDataHandlers.createOrUpdateProductVariations(productId, newProduct.productVariations);
                setRefreshProducts && setRefreshProducts();
            }

            if(!state.productVariations || state.productVariations.length === 0) {
                const newProduct = useProductDataHandlers.hasNoProductVariations(state, orderedImagesByIndex, productId);
                await createNewProductDocument(newProduct, productId);
                console.log('novo produto criado', newProduct);
                handlers.handleVariationsChange([]);
                setRefreshProducts && setRefreshProducts();
                await useProductDataHandlers.createOrUpdateProductVariations(productId, newProduct.productVariations);

            }
            goToProductPage && goToProductPage();
            setLoadingButton(false);
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <section className='flex flex-col gap-2 w-full'>
            { /* <h1 className='font-bold'>{ product ? 'Editar Produto': 'Novo Produto' }</h1> */ }
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
            { finishFormError && <p className='text-red-500'>{ finishFormError }</p> }

            <LargeButton color='blue' loadingButton={ loadingButton } onClick={ handleCreateNewProductClick }>
                { product ? 'Salvar': 'Criar' }
            </LargeButton>
            <LargeButton color='green ' loadingButton={ false } onClick={ () => {
                console.log('state', state);
                console.log('oldState', oldStateRef.current);
            } }>
                Mostrar estado
            </LargeButton>
        </section>
    );
}
