'use client';

import { useNewProductState } from '@/app/hooks/useNewProductState';
import NameAndDescriptionSection from './NameAndDescriptionSection';
import LargeButton from '@/app/components/LargeButton';

export default function NewProductPage() {
    const {
        state,
        handleNameChange,
        handleDescriptionChange,
    } = useNewProductState();
    return (
        <main className='flex flex-col gap-2'>
            <NameAndDescriptionSection
                state={ state }
                handleNameChange={ handleNameChange }
                handleDescriptionChange={ handleDescriptionChange }
            />
            <LargeButton color='blue' onClick={ () => console.log(state) } loadingButton={ false }>
            mostrar estado
            </LargeButton>
        </main>
    );
}