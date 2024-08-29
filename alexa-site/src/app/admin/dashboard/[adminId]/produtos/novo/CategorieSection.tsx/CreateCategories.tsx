// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CreateCategoriesForm.tsx

import { CategoryType, CheckboxData, FireBaseDocument, UseNewProductState } from '@/app/utils/types';
import CategoriesListFromFb from './CategoriesListFromFb';
import SelectedCategoriesList from './SelectedCategoriesList';
import { useEffect, useState } from 'react';
import { useCollection } from '@/app/hooks/useCollection';

interface CreateCategoriesFormProps { categories: string[]; handlers: UseNewProductState; }

export default function CreateCategoriesForm({ categories, handlers }: CreateCategoriesFormProps) {
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
