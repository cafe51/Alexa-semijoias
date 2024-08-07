// app/admin/dashboard/[adminId]/produtos/novo/CategoriesSection/CreateCategoriesForm.tsx

import { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';


interface CreateCategoriesFormProps {
    handleAddCategories: (category: string) => void
    handleRemoveAllCategories: () => void
    handleRemoveCategory: (category: string) => void
    categories: string[];
}

export default function CreateCategoriesForm({
    categories,
    handleAddCategories,
    // handleRemoveAllCategories,
    handleRemoveCategory,
}: CreateCategoriesFormProps) {
    const [newCategory, setNewCategory] = useState('');

    function handleAddCategoryClick() {
        (newCategory && newCategory.length > 0) && handleAddCategories(newCategory);
        setNewCategory('');
    }


    return (
        <section className='flex flex-col items-center  gap-2 w-full'>
            <div className="">
                <label className="block text-sm font-medium" htmlFor="newVariation">Nova categoria</label>
                <div className='w-full'>
                    <input
                        className="mt-1 block px-3 py-2 border rounded-md w-full"
                        id="newVariation"
                        name="newVariation"
                        type="text"
                        value={ newCategory }
                        onChange={ (e) => setNewCategory(e.target.value) }
                        placeholder='Insira a nova variação'
                    />
                    <button
                        className='p-2 rounded-full bg-green-400 w-full mt-2 disabled:bg-green-200 disabled:text-gray-400'
                        onClick={ handleAddCategoryClick }
                        disabled={ !newCategory }>
                        +
                    </button>
                </div>
            </div>
            <div className='flex flex-col w-5/6 gap-2'>

                {
                    categories
                        .map((category, index) => {
                            return (
                                category.length > 0
                          &&
                          (<div key={ index } className="flex min-h-12">
                              <input
                                  className="block w-full px-3 border rounded-l-md "
                                  id={ `variation ${index}` }
                                  name={ `variation ${index}` }
                                  type="text"
                                  value={ category }
                                  onChange={ (e) => setNewCategory(e.target.value) }
                                  readOnly={ true }

                              />
                              <button className='px-3 bg-red-400 rounded-r-md' onClick={ () => handleRemoveCategory(category) }>
                                  <FaRegTrashAlt/>
                              </button>

                          </div>)
                            );
                        })
                }
            </div>
        </section>
          
    );
}
