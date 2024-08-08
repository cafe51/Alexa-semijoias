// app/admin/dashboard/[adminId]/produtos/novo/CodesSection.tsx
import { StateNewProductType } from '@/app/utils/types';
import React from 'react';

interface CodesSectionProps {
    state: StateNewProductType;
    handleSkuChange: (sku: string) => void;
    handleBarcodeChange: (barcode: string) => void;
}

export default function CodesSection({
    state,
    handleSkuChange,
    handleBarcodeChange,
}: CodesSectionProps){
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Códigos</h2>
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor='sku'>SKU</label>
                <input
                    id='sku'
                    name='sku'
                    type="text"
                    value={ state.sku ? state.sku : '' }
                    onChange={ (e) => handleSkuChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="SKU"
                />
            </div>
            <div className="mt-2">
                <label className="block text-sm font-medium" htmlFor='barcode'>Código de barras</label>
                <input
                    id='barcode'
                    name='barcode'
                    type="text"
                    value={ state.barcode ? state.barcode : '' }
                    onChange={ (e) => handleBarcodeChange(e.target.value) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="Código de barras"
                />
            </div>
        </section>
    );
}


