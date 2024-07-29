// app/admin/dashboard/[adminId]/produtos/novo/page.tsx
'use client';
import { useNewProductState } from '@/app/hooks/useNewProductState';
import LargeButton from '@/app/components/LargeButton';
import NameAndDescriptionSection from './NameAndDescriptionSection';
import PhotosSection from './PhotosSection';
import PricesSection from './PricesSection';
import StockSection from './StockSection';
import CodesSection from './CodesSection';

export default function NewProductPage() {
    const {
        state,
        handleNameChange,
        handleDescriptionChange,
        handleValueChange,
        handleStockQuantityChange,
        handleStockTypeChange,
        handleBarcodeChange,
        handleSkuChange,
    } = useNewProductState();

    return (
        <main className='flex flex-col gap-2'>
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
            <LargeButton color='blue' onClick={ () => console.log(state) } loadingButton={ false }>
            mostrar estado
            </LargeButton>
        </main>
    );
}
