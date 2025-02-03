// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/CreateVariationsForm.tsx

import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction, useState } from 'react';
import VariationsList from './VariationsList';
import { removePunctuationAndSpace } from '@/app/utils/removePunctuationAndSpace';

interface CreateVariationsFormProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    setProductVariationState: Dispatch<SetStateAction<VariationProductType>>
    handleRemoveVariation(v: string): void;
}

export default function CreateVariationsForm({ state, handlers, setProductVariationState, handleRemoveVariation }: CreateVariationsFormProps) {
    const [errorMessage, setErrorMessage] = useState<string>();
    const [newVariation, setNewVariation] = useState('');

    function handleAddVariationClick() {
        if(state.variations.length > 0 && state.variations.includes(newVariation.trim().toLowerCase())) {
            setErrorMessage('Essa variação já existe');
            return;
        }
        (newVariation && newVariation.length > 0) && handlers.handleVariationsChange([...state.variations, newVariation.toLowerCase().trim().toLowerCase()]);
        setProductVariationState((prevState) => ({
            ...prevState,
            customProperties: {
                ...prevState.customProperties,
                [newVariation.toLowerCase().trim().toLowerCase()]: '',
            },

        }));
        handlers.handleAddNewVariationInAllProductVariations(newVariation.toLowerCase().trim().toLowerCase());
        setNewVariation('');
    }


    return (
        <section className='flex flex-col items-center  gap-2 w-full'>

            <VariationsList
                handleRemoveVariation={ handleRemoveVariation }
                variations={ state.variations }
            />
            <div className="">
                <label className="block text-sm font-medium" htmlFor="newVariation">Nova variação</label>
                <div className='w-full'>
                    <input
                        className="mt-1 block px-3 py-2 border rounded-md w-full"
                        id="newVariation"
                        name="newVariation"
                        type="text"
                        value={ newVariation.toLowerCase() }
                        onChange={ (e) => {
                            setNewVariation(removePunctuationAndSpace(e.target.value).toLowerCase());
                            setErrorMessage(undefined);
                        } }
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
            { errorMessage && <p className='text-sm text-center justify-self-center text-red-500'>{ errorMessage }</p> }
        </section>
          
    );
}
