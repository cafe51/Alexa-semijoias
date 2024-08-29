// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CreateCategoriesForm.tsx

import { CategoryType, CheckboxData, FireBaseDocument } from '@/app/utils/types';
import CategoriesListFromFb from './CategoriesListFromFb';
import SelectedCategoriesList from './SelectedCategoriesList';
import { useEffect, useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';

interface CreateCategoriesFormProps {
    handleAddCategories: (category: string) => void
    handleRemoveAllCategories: () => void
    handleRemoveCategory: (category: string) => void
    categories: string[];
    handleSetCategoriesFromFb: (category: string[]) => void
}

export default function CreateCategoriesForm({
    categories,
    handleAddCategories,
    handleSetCategoriesFromFb,
    handleRemoveCategory,
}: CreateCategoriesFormProps) {
    const [categoriesStateFromFirebase, setCategoriesStateFromFirebase] = useState<(CategoryType & FireBaseDocument)[] | never[]>([]);
    const { getAllDocuments } = useCollection<CategoryType>('categories');
    const [options, setOptions] = useState<CheckboxData[]>([]);

    useEffect(() => {
        async function getCategoriesFromFirebase() {
            const res = await getAllDocuments();
            console.log('categorias', res);
            setCategoriesStateFromFirebase(res);
        }
        getCategoriesFromFirebase();
    }, []);

    useEffect(() => {
        const initialOptions = categoriesStateFromFirebase
            .map((c) => c.categoryName)
            .map((label) => ({ label, isChecked: false }));
        setOptions(initialOptions);
    }, [categoriesStateFromFirebase]);

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
