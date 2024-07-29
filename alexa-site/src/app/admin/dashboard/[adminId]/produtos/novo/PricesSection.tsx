// app/admin/dashboard/[adminId]/produtos/novo/PricesSection.tsx

import { UseNewProductStateType } from '@/app/utils/types';

interface PricesSectionProps {
    state: UseNewProductStateType;
    handleValueChange: (value: { price: number, promotionalPrice: number, cost: number, }) => void;
}

export default function PricesSection({
    state,
    handleValueChange,
} : PricesSectionProps){
    return (
        <section className="p-4 border rounded-md bg-white">
            <h2 className="text-lg font-bold">Preços</h2>
            <div className="mt-2">
                <label htmlFor='price' className="block text-sm font-medium">Preço de venda</label>
                <input
                    id='price'
                    name='price'
                    type="number"
                    value={ state.value.price }
                    onChange={ (e) => handleValueChange({ ...state.value, price: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="R$ 0,00"
                />
            </div>
            <div className="mt-2">
                <label htmlFor='promotionalPrice' className="block text-sm font-medium">Preço promocional</label>
                <input
                    id='promotionalPrice'
                    name='promotionalPrice'
                    type="number"
                    value={ state.value.promotionalPrice }
                    onChange={ (e) => handleValueChange({ ...state.value, promotionalPrice: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="R$ 0,00"
                />
            </div>
            <div className="mt-2">
                <label htmlFor='cost' className="block text-sm font-medium">Custo</label>
                <input
                    id='cost'
                    name='cost'
                    type="number"
                    value={ state.value.cost }
                    onChange={ (e) => handleValueChange({ ...state.value, cost: Number(e.target.value) }) }
                    className="mt-1 block w-full px-3 py-2 border rounded-md"
                    placeholder="R$ 0,00"
                />
            </div>
        </section>
    );
}
