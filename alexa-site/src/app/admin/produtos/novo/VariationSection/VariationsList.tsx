// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/VariationsList.tsx
import { FaRegTrashAlt } from 'react-icons/fa';

interface VariationsListProps {
    variations: string[];
    handleRemoveVariation(v: string): void;
}

export default function VariationsList({ variations, handleRemoveVariation }: VariationsListProps) {
    return(
        <div className='flex flex-col w-5/6 gap-2'>

            {
                variations
                    .map((variation, index) => {
                        return (
                            variation.length > 0
                          &&
                          (<div key={ index } className="flex min-h-12">
                              <input
                                  className="block w-full px-3 border rounded-l-md "
                                  id={ `variation ${index}` }
                                  name={ `variation ${index}` }
                                  type="text"
                                  value={ variation }
                                  readOnly={ true }

                              />
                              <button className='px-3 bg-red-400 rounded-r-md' onClick={ () => handleRemoveVariation(variation) }>
                                  <FaRegTrashAlt/>
                              </button>

                          </div>)
                        );
                    })
            }
        </div>
    );
}