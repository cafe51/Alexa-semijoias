// app/admin/dashboard/[adminId]/produtos/novo/StockSection.tsx
import { FullProductType } from '@/app/utils/types';
import React from 'react';

interface StockSectionProps {
    state: FullProductType;
    handleStockQuantityChange: (stockQuantity: number) => void;
}

export default function StockSection({
    state,
    handleStockQuantityChange,
}: StockSectionProps){
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Estoque</h2>
            <input
                id='stockQuantity'
                name="stockType"
                type="number"
                value={ state.stockQuantity ? state.stockQuantity : 0 }
                onChange={ (e) => handleStockQuantityChange(Number(e.target.value)) }
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                placeholder="Quantidade"
            />
        </section>
    );
}

