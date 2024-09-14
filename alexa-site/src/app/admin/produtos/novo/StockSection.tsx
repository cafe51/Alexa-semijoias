// app/admin/dashboard/[adminId]/produtos/novo/StockSection.tsx
import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { StateNewProductType, UseNewProductState } from '@/app/utils/types';
import React from 'react';

interface StockSectionProps { state: StateNewProductType; handlers: UseNewProductState; }

export default function StockSection({ state, handlers }: StockSectionProps){
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="font-bold">Estoque</h2>
            <input
                id='estoque'
                name="estoque"
                type="text"
                value={ state.estoque ? state.estoque : 0 }
                onChange={ (e) => transformTextInputInNumber(e.target.value, handlers.handleStockQuantityChange) }
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                placeholder="Estoque"
            />
        </section>
    );
}

