// app/admin/dashboard/[adminId]/produtos/novo/StockSection.tsx
import { UseNewProductStateType } from '@/app/utils/types';
import React from 'react';

interface StockSectionProps {
    state: UseNewProductStateType;
    handleStockTypeChange: (stockType: 'infinite' | 'limited') => void;
    handleStockQuantityChange: (stockQuantity: number) => void;
}

export default function StockSection({
    state,
    handleStockTypeChange,
    handleStockQuantityChange,
}: StockSectionProps){
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Estoque</h2>
            <div className="mt-2">
                <label className="block text-sm font-medium">Infinito</label>
                <input
                    type="radio"
                    name="stockType"
                    checked={ state.stockType === 'infinite' }
                    onChange={ () => handleStockTypeChange('infinite') }
                    className="mr-2"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm font-medium">Limitado</label>
                <input
                    type="radio"
                    name="stockType"
                    checked={ state.stockType === 'limited' }
                    onChange={ () => handleStockTypeChange('limited') }
                    className="mr-2"
                />
                { state.stockType === 'limited' && (
                    <input
                        type="number"
                        value={ state.stockQuantity }
                        onChange={ (e) => handleStockQuantityChange(Number(e.target.value)) }
                        className="mt-1 block w-full px-3 py-2 border rounded-md"
                        placeholder="Quantidade"
                    />
                ) }
            </div>
        </section>
    );
}

