// app/admin/dashboard/[adminId]/produtos/novo/DimensionsSection.tsx

import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { StateNewProductType } from '@/app/utils/types';
import React from 'react';

interface DimensionsSectionProps {
    state: StateNewProductType;
    handleDimensionsChange: (dimensions: { largura: number, altura: number, comprimento: number, peso: number }) => void;
}

export default function DimensionsSection({
    state,
    handleDimensionsChange,
}: DimensionsSectionProps) {

    function handleChange(input: number, state: StateNewProductType, property: string) {
        if(state && state.dimensions){
            handleDimensionsChange({
                ...state.dimensions,
                [property]: input,
            });
        }
        if(state && !state.dimensions) {
            handleDimensionsChange({
                altura: 0,
                comprimento: 0,
                largura: 0,
                peso: 0,
                [property]: (input),
            });
        }
    }

    const properties: ['largura', 'altura', 'comprimento', 'peso'] = ['largura', 'altura', 'comprimento', 'peso'];

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold  p-2">Peso e dimensões</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>
                {
                    properties.map((property, index) => {
                        return (
                            <div key={ index } className="w-5/12">
                                <label htmlFor={ property } className="text-xs font-medium w-full">{ property.replace(/^\w/, (c) => c.toUpperCase()) }</label>
                                <input
                                    id={ property }
                                    name={ property }                                
                                    type="text"
                                    value={ state && state.dimensions ? state.dimensions[property] : 0 }
                                    onChange={ (e) => transformTextInputInNumber(e.target.value, (input) => handleChange(input, state, property)) }
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                    placeholder={ property }
                                />
                            </div>
                        );
                    })
                }
            </div>
        </section>
    );
}
