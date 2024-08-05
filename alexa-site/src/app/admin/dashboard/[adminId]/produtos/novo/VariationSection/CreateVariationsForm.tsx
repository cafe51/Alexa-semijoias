// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/CreateVariationsForm.tsx

import { VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';


interface CreateVariationsFormProps {
  handleVariationsChange: (variations: string[] | never[]) => void;
  variations: string[] | never[];
  handleAddNewVariationInAllProductVariations: (newVariation: string) => void;
  handleRemoveVariationInAllProductVariations: (variationToBeRemoved: string) => void;
  handleClearProductVariations: () => void;
  setProductVariationState: Dispatch<SetStateAction<VariationProductType>>
}

export default function CreateVariationsForm({
    handleVariationsChange,
    variations,
    handleAddNewVariationInAllProductVariations,
    handleRemoveVariationInAllProductVariations,
    handleClearProductVariations,
    setProductVariationState,
}: CreateVariationsFormProps) {
    const [newVariation, setNewVariation] = useState('');

    function handleAddVariationClick() {
        (newVariation && newVariation.length > 0) && handleVariationsChange([...variations, newVariation]);
        setProductVariationState((prevState) => ({
            ...prevState,
            customProperties: {
                ...prevState.customProperties,
                [newVariation]: '',
            },

        }));
        handleAddNewVariationInAllProductVariations(newVariation);
        setNewVariation('');
    }

    function handleRemoveVariation(v: string) {
        const newVariations = variations.filter((vstate) => vstate !== v);
        handleVariationsChange(newVariations);
        setProductVariationState((prevState) => {
            const newState = { ...prevState };
            delete newState.customProperties[v];
            return newState;
        });
       

        handleRemoveVariationInAllProductVariations(v);
        newVariations.length === 0 && handleClearProductVariations();
    }

    return (
        <section className='flex flex-col items-center  gap-2 w-full'>
            <div className="">
                <label className="block text-sm font-medium" htmlFor="newVariation">Nova variação</label>
                <div className='w-full'>
                    <input
                        className="mt-1 block px-3 py-2 border rounded-md w-full"
                        id="newVariation"
                        name="newVariation"
                        type="text"
                        value={ newVariation }
                        onChange={ (e) => setNewVariation(e.target.value) }
                        placeholder='Insira a nova variação'
                    />
                    <button
                        className='p-2 rounded-full bg-green-400 w-full mt-2 disabled:bg-green-200 disabled:text-gray-400'
                        onClick={ handleAddVariationClick }
                        disabled={ !newVariation }>
                        +
                    </button>
                </div>
            </div>
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
                                  onChange={ (e) => setNewVariation(e.target.value) }
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
        </section>
          
    );
}
