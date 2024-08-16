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
    // handleRemoveAllCategories,
    handleRemoveCategory,
}: CreateCategoriesFormProps) {
    // const [newCategory, setNewCategory] = useState('');
    // const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    // useEffect(() => console.log(selectedOptions), [selectedOptions]);



    // function handleAddCategoryClick() {
    //     (newCategory && newCategory.length > 0) && handleAddCategories(newCategory);
    //     setNewCategory('');
    // }

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

            />
            { /* <div className="">
                <label className="block text-sm font-medium" htmlFor="newCategory">Nova categoria</label>
                <div className='w-full'>
                    <input
                        className="mt-1 block px-3 py-2 border rounded-md w-full"
                        id="newCategory"
                        name="newCategory"
                        type="text"
                        value={ newCategory }
                        onChange={ (e) => setNewCategory(e.target.value) }
                        placeholder='Insira a nova categoria'
                    />
                    <button
                        className='p-2 rounded-full bg-green-400 w-full mt-2 disabled:bg-green-200 disabled:text-gray-400'
                        onClick={ handleAddCategoryClick }
                        disabled={ !newCategory }>
                        +
                    </button>
                </div>
            </div> */ }
            <SelectedCategoriesList
                handleCheckboxChange={ handleCheckboxChange }
                handleRemoveCategory={ handleRemoveCategory }
                selectedOptions={ categories }
                handleAddCategories={ handleAddCategories }
            />
        </section>
          
    );
}
