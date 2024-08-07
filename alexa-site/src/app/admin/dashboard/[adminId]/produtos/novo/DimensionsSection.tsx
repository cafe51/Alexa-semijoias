// app/admin/dashboard/[adminId]/produtos/novo/DimensionsSection.tsx

import { FullProductType } from '@/app/utils/types';
import React from 'react';

interface DimensionsSectionProps {
    state: FullProductType;
    handleDimensionsChange: (dimensions: { length: number, width: number, height: number, weight: number }) => void;
}

export default function DimensionsSection({
    state,
    handleDimensionsChange,
}: DimensionsSectionProps) {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, state: FullProductType, property: string) {
        if(state && state.dimensions){
            handleDimensionsChange({
                ...state.dimensions,
                [property]: Number(e.target.value),
            });
        }
        if(state && !state.dimensions) {
            handleDimensionsChange({
                height: 0,
                length: 0,
                weight: 0,
                width: 0,
                [property]: Number(e.target.value),
            });
        }
    }

    const properties: ['weight', 'length', 'height', 'width'] = ['weight', 'length', 'height', 'width'];

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold  p-2">Peso e dimensões</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>
                {
                    properties.map((property, index) => {
                        return (
                            <div key={ index } className="w-5/12">
                                <label htmlFor={ property } className="text-xs font-medium w-full">{ property }</label>
                                <input
                                    id={ property }
                                    name={ property }                                
                                    type="number"
                                    value={ state && state.dimensions ? state.dimensions[property] : 0 }
                                    onChange={ (e) =>handleChange(e, state, property) }
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
