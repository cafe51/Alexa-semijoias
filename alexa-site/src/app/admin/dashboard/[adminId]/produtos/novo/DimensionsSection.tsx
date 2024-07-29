// app/admin/dashboard/[adminId]/produtos/novo/DimensionsSection.tsx

import { UseNewProductStateType } from '@/app/utils/types';
import React from 'react';

interface DimensionsSectionProps {
    state: UseNewProductStateType;
    handleDimensionsChange: (dimensions: { length: number, width: number, height: number, weight: number }) => void;
}

export default function DimensionsSection({
    state,
    handleDimensionsChange,
}: DimensionsSectionProps) {
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Peso e dimensões</h2>
            <div className="mt-2">
                <label htmlFor='weight' className="block text-sm font-medium">Peso</label>
                <input
                    id='weight'
                    name='weight'                                
                    type="number"
                    value={ state.dimensions.weight }
                    onChange={ (e) => handleDimensionsChange({ ...state.dimensions, weight: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Peso"
                />
            </div>
            <div className="mt-2">
                <label htmlFor='length' className="block text-sm font-medium">Comprimento</label>
                <input
                    id='length'
                    name='length'
                    type="number"
                    value={ state.dimensions.length }
                    onChange={ (e) => handleDimensionsChange({ ...state.dimensions, length: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Comprimento"
                />
            </div>
            <div className="mt-2">
                <label htmlFor='width' className="block text-sm font-medium">Largura</label>
                <input
                    id='width'
                    name='width'
                    type="number"
                    value={ state.dimensions.width }
                    onChange={ (e) => handleDimensionsChange({ ...state.dimensions, width: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Largura"
                />
            </div>
            <div className="mt-2">
                <label htmlFor='height' className="block text-sm font-medium">Altura</label>
                <input
                    id='height'
                    name='height'
                    type="number"
                    value={ state.dimensions.height }
                    onChange={ (e) => handleDimensionsChange({ ...state.dimensions, height: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Altura"
                />
            </div>
        </section>
    );
}
