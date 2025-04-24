'use client';
import { useNewProductState } from '@/app/hooks/useNewProductState';
import {
    FireBaseDocument,
    ProductBundleType,
    StateNewProductType,
    UseProductDataHandlers,
} from '@/app/utils/types';
import LargeButton from '@/app/components/LargeButton';
import { useCollection } from '@/app/hooks/useCollection';
import { productIdGenerator } from '@/app/utils/productIdGenerator';
import NameAndDescriptionSection from './novo/NameAndDescriptionSection';
import PhotosSection from './novo/PhotoSection/PhotosSection';
import VideoSection from './novo/VideoSection/VideoSection';
import PricesSection from './novo/PricesSection';
import SiteSectionSection from './novo/SiteSectionSection/SiteSectionSection';
import CategoriesSection from './novo/CategoriesSection.tsx/CategoriesSection';
import VariationsSection from './novo/VariationSection/VariationsSection';
import StockSection from './novo/StockSection';
import DimensionsSection from './novo/DimensionsSection';
import CodesSection from './novo/CodesSection';
import MoreOptionsSection from './novo/MoreOptionsSection';
import CollectionsSection from './novo/CollectionsSection/CollectionsSection';
import { useState, useRef, useEffect } from 'react';
import { createSlugName } from '@/app/utils/createSlugName';

interface ProductEditionFormProps {
  product?: StateNewProductType;
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
    const [finishFormError, setFinishFormError] = useState<
    string | undefined
  >(undefined);
    const { addDocument: createNewProductDocument } = useCollection<
    ProductBundleType
  >('products');
    const [loadingButton, setLoadingButton] = useState(false);
    const oldStateRef = useRef<StateNewProductType | null>(null);

    useEffect(() => {
        if (oldStateRef.current === null) {
            oldStateRef.current = state;
        }
    }, [state]);

    const handleCreateNewProductClick = async() => {
        try {
            setLoadingButton(true);
            const oldState = oldStateRef.current!;
            const valid = await useProductDataHandlers.verifyFieldsOnFinishProductCreation(
                state,
                oldState,
                setFinishFormError,
            );
            if (!valid) {
                setLoadingButton(false);
                return;
            }

            // upload images
            const allImagesUrls = await useProductDataHandlers.uploadAndGetAllImagesUrl(
                state.images,
                productFromFirebase?.images,
            );

            // generate product ID
            const productId = productIdGenerator(
                productFromFirebase,
                state.barcode,
                state.productVariations[0]?.defaultProperties?.barCode,
            );

            // upload or delete video as needed
            const videoUrl = await useProductDataHandlers.handleProductVideo(
                state.video ? state.video : null,
                productFromFirebase?.videoUrl,
                createSlugName(state.name),
                state.barcode || '',
            );

            // helper to attach videoUrl
            const attachVideo = (pb: ProductBundleType) => ({
                ...pb,
                videoUrl,
            });

            // create or update categories & sections
            await useProductDataHandlers.createOrUpdateCategories(state.categories);
            await useProductDataHandlers.createAndUpdateSiteSections(
                state.sectionsSite,
            );

            // branch: with variations
            if (state.productVariations.length > 0) {
                let newProduct = useProductDataHandlers.hasProductVariations(
                    state,
                    allImagesUrls.sort((a, b) => a.index - b.index),
                    productId,
                );
                newProduct = attachVideo(newProduct);

                await createNewProductDocument(newProduct, productId);
                await useProductDataHandlers.createOrUpdateProductVariations(
                    productId,
                    newProduct.productVariations,
                );
                setRefreshProducts?.();
            } else {
                // no variations
                let newProduct = useProductDataHandlers.hasNoProductVariations(
                    state,
                    allImagesUrls.sort((a, b) => a.index - b.index),
                    productId,
                );
                newProduct = attachVideo(newProduct);

                await createNewProductDocument(newProduct, productId);
                await useProductDataHandlers.createOrUpdateProductVariations(
                    productId,
                    newProduct.productVariations,
                );
                setRefreshProducts?.();
            }

            goToProductPage?.();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingButton(false);
        }
    };

    return (
        <section className="flex flex-col gap-2 w-full">
            <NameAndDescriptionSection state={ state } handlers={ handlers } />
            <PhotosSection
                state={ state }
                handleSetImages={ handlers.handleSetImages }
            />
            <VideoSection
                video={ state.video ? state.video : null }
                handleSetVideo={ handlers.handleSetVideo }
            />
            <PricesSection state={ state } handleValueChange={ handlers.handleValueChange } />
            <SiteSectionSection state={ state } handlers={ handlers } />
            <CategoriesSection state={ state } handlers={ handlers } />
            <VariationsSection state={ state } handlers={ handlers } />

            { (!state.productVariations || state.productVariations.length === 0) && (
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
            ) }

            <CollectionsSection state={ state } handlers={ handlers } />
            <MoreOptionsSection state={ state } handlers={ handlers } />

            { finishFormError && (
                <p className="text-red-500">{ finishFormError }</p>
            ) }

            <LargeButton
                color="blue"
                loadingButton={ loadingButton }
                onClick={ handleCreateNewProductClick }
            >
                { product ? 'Salvar' : 'Criar' }
            </LargeButton>
        </section>
    );
}
