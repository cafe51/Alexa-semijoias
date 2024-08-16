import { FaRegTrashAlt } from 'react-icons/fa';

interface SelectedCategoriesListProps {
selectedOptions: string[];
  handleCheckboxChange(label: string): void;
  handleRemoveCategory: (category: string) => void;
  handleAddCategories: (category: string) => void
}

export default function SelectedCategoriesList({ selectedOptions, handleCheckboxChange, handleRemoveCategory  }: SelectedCategoriesListProps) {
    return (
        <section className='flex flex-col w-5/6 h-48 px-3 pb-3 gap-2 overflow-y-auto'>

            {
                selectedOptions
                    .map((category, index) => {
                        return (
                            category.length > 0
                          &&
                          (<div key={ index } className="flex min-h-12">
                              <input
                                  className="block w-full px-3 border rounded-l-md "
                                  id={ `selectedCategory ${index}` }
                                  name={ `selectedCategory ${index}` }
                                  type="text"
                                  value={ category }
                                  readOnly={ true }

                              />
                              <button className='px-3 bg-red-400 rounded-r-md' onClick={ () => {
                                  handleRemoveCategory(category);
                                  handleCheckboxChange(category);

                              } }>
                                  <FaRegTrashAlt/>
                              </button>

                          </div>)
                        );
                    })
            }
        </section>
    );
}