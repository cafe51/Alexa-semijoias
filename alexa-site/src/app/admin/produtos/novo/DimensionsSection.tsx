import { StateNewProductType, UseNewProductState } from '@/app/utils/types';
import React, { useEffect, useState } from 'react';
import InputSection from './InputSection';

interface DimensionsSectionProps { state: StateNewProductType; handlers: UseNewProductState; }

export default function DimensionsSection({ state, handlers }: DimensionsSectionProps) {
    const [dimensionsState, setDimensionsState] = useState({
        altura: state.dimensions && state.dimensions.altura ? state.dimensions.altura : 0,
        comprimento: state.dimensions && state.dimensions.comprimento ? state.dimensions.comprimento : 0,
        largura: state.dimensions && state.dimensions.largura ? state.dimensions.largura : 0,
        peso: state.dimensions && state.dimensions.peso ? state.dimensions.peso : 0,
    });

    useEffect(() => {
        if(state.dimensions) {
            setDimensionsState(state.dimensions);
        }
    }, [state.dimensions]);

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold  p-2">Peso e dimensões</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>
                <InputSection handleChange={ handlers.handleDimensionsChange } stateToBeChange={ dimensionsState } unitType='dimension'/>
            </div>
        </section>
    );
}
