// app/admin/dashboard/[adminId]/produtos/novo/page.tsx
'use client';
import { useNewProductState } from '@/app/hooks/useNewProductState';
import LargeButton from '@/app/components/LargeButton';
import NameAndDescriptionSection from './NameAndDescriptionSection';
import PhotosSection from './PhotosSection';
import PricesSection from './PricesSection';

export default function NewProductPage() {
    const {
        state,
        handleNameChange,
        handleDescriptionChange,
        handleValueChange,
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
            <LargeButton color='blue' onClick={ () => console.log(state) } loadingButton={ false }>
            mostrar estado
            </LargeButton>
        </main>
    );
}
