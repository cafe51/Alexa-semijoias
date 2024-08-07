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
    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold  p-2">Peso e dimensões</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>
                <div className="w-5/12">
                    <label htmlFor='weight' className="text-xs font-medium w-full">Peso</label>
                    <input
                        id='weight'
                        name='weight'                                
                        type="number"
                        value={ state.dimensions.weight }
                        onChange={ (e) => handleDimensionsChange({ ...state.dimensions, weight: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Peso"
                    />
                </div>
                <div className="w-5/12">
                    <label htmlFor='length' className="text-xs font-medium w-full">Comprimento</label>
                    <input
                        id='length'
                        name='length'
                        type="number"
                        value={ state.dimensions.length }
                        onChange={ (e) => handleDimensionsChange({ ...state.dimensions, length: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Comprimento"
                    />
                </div>
                <div className="w-5/12">
                    <label htmlFor='width' className="text-xs font-medium w-full">Largura</label>
                    <input
                        id='width'
                        name='width'
                        type="number"
                        value={ state.dimensions.width }
                        onChange={ (e) => handleDimensionsChange({ ...state.dimensions, width: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Largura"
                    />
                </div>
                <div className="w-5/12">
                    <label htmlFor='height' className="text-xs font-medium w-full">Altura</label>
                    <input
                        id='height'
                        name='height'
                        type="number"
                        value={ state.dimensions.height }
                        onChange={ (e) => handleDimensionsChange({ ...state.dimensions, height: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="Altura"
                    />
                </div>
            </div>
        </section>
    );
}
