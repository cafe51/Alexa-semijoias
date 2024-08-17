// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CreateCategoriesForm.tsx

import { CheckboxData } from '@/app/utils/types';
import CategoriesListFromFb from './CategoriesListFromFb';
import SelectedCategoriesList from './SelectedCategoriesList';
import { Dispatch, SetStateAction } from 'react';

interface CreateCategoriesFormProps {
    handleAddCategories: (category: string) => void
    handleRemoveAllCategories: () => void
    handleRemoveCategory: (category: string) => void
    categories: string[];
    handleSetCategoriesFromFb: (category: string[]) => void
    options: CheckboxData[];
    setOptions: Dispatch<SetStateAction<CheckboxData[]>>
}

export default function CreateCategoriesForm({
    categories,
    handleAddCategories,
    handleSetCategoriesFromFb,
    options,
    setOptions,
    handleRemoveCategory,
}: CreateCategoriesFormProps) {
    function handleCheckboxChange(label: string) {
        const updatedOptions = options.map((option) =>
            option.label === label ? { ...option, isChecked: !option.isChecked } : option,
        );
        setOptions(updatedOptions);
      
        // Atualizando selectedOptions
        const newSelectedOptions = updatedOptions
            .filter((option) => option.isChecked)
            .map((option) => option.label);
        handleSetCategoriesFromFb(newSelectedOptions);
    }

    return (
        <section className='flex flex-col items-center gap-2 w-full'>
            <CategoriesListFromFb
                handleCheckboxChange={ handleCheckboxChange }
                options={ options }
                handleAddCategories={ handleAddCategories }
                selectedOptions={ categories }


            />
            <SelectedCategoriesList
                handleCheckboxChange={ handleCheckboxChange }
                handleRemoveCategory={ handleRemoveCategory }
                selectedOptions={ categories }
                handleAddCategories={ handleAddCategories }
            />
        </section>
          
    );
}
