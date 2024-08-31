// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CreateCategoriesForm.tsx

import { CheckboxData, UseNewProductState } from '@/app/utils/types';
import CategoriesListFromFb from './CategoriesListFromFb';
import SelectedCategoriesList from './SelectedCategoriesList';
import { Dispatch, SetStateAction } from 'react';


interface CreateCategoriesFormProps {
    categories: string[];
    handlers: UseNewProductState;
    options: CheckboxData[];
    setOptions: Dispatch<SetStateAction<CheckboxData[]>>;
}

export default function CreateCategoriesForm({ categories, handlers, options, setOptions }: CreateCategoriesFormProps) {
    function handleCheckboxChange(label: string) {
        const updatedOptions = options.map((option) =>
            option.label === label ? { ...option, isChecked: !option.isChecked } : option,
        );
        setOptions(updatedOptions);
      
        // Atualizando selectedOptions
        const newSelectedOptions = updatedOptions
            .filter((option) => option.isChecked)
            .map((option) => option.label);
        handlers.handleSetCategoriesFromFb(newSelectedOptions);
    }

    return (
        <section className='flex flex-col items-center gap-2 w-full'>
            <CategoriesListFromFb
                handlers={ handlers }
                handleCheckboxChange={ handleCheckboxChange }
                options={ options }
                selectedOptions={ categories }


            />
            <SelectedCategoriesList
                handlers={ handlers }
                handleCheckboxChange={ handleCheckboxChange }
                selectedOptions={ categories }
            />
        </section>
          
    );
}
