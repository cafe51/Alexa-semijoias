// app/admin/dashboard/[adminId]/produtos/novo/StockSection.tsx
import { StateNewProductType } from '@/app/utils/types';
import React from 'react';

interface StockSectionProps {
    state: StateNewProductType;
    handleStockQuantityChange: (estoque: number) => void;
}

export default function StockSection({
    state,
    handleStockQuantityChange,
}: StockSectionProps){
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="font-bold">Estoque</h2>
            <input
                id='estoque'
                name="estoque"
                type="number"
                value={ state.estoque ? state.estoque : 0 }
                onChange={ (e) => handleStockQuantityChange(Number(e.target.value)) }
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                placeholder="Estoque"
            />
        </section>
    );
}

