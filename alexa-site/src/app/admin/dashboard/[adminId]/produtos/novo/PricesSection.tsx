// app/admin/dashboard/[adminId]/produtos/novo/PricesSection.tsx

import { StateNewProductType } from '@/app/utils/types';

interface PricesSectionProps {
    state: StateNewProductType;
    handleValueChange: (value: { price: number, promotionalPrice: number, cost: number, }) => void;
}



export default function PricesSection({
    state: { value },
    handleValueChange,
} : PricesSectionProps){

    const marginProfitValue = (v: typeof value) => {
        const finalPrice = v.promotionalPrice && v.promotionalPrice > 0 ? v.promotionalPrice : v.price;
        const profit = (finalPrice - v.cost);
        const margin = profit/finalPrice;
        return margin * 100;
    };

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold p-2">Preços</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>
                <div className="w-5/12">
                    <label htmlFor='price' className="text-xs font-medium w-full">Preço de venda</label>
                    <input
                        id='price'
                        name='price'
                        type="number"
                        value={ value.price }
                        onChange={ (e) => handleValueChange({ ...value, price: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="R$ 0,00"
                    />
                </div>
                <div className="w-5/12">
                    <label htmlFor='promotionalPrice' className="text-xs font-medium">Preço promocional</label>
                    <input
                        id='promotionalPrice'
                        name='promotionalPrice'
                        type="number"
                        value={ value.promotionalPrice }
                        onChange={ (e) => handleValueChange({ ...value, promotionalPrice: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="R$ 0,00"
                    />
                </div>
                <div className="w-5/12">
                    <label htmlFor='cost' className="text-xs font-medium">Custo</label>
                    <input
                        id='cost'
                        name='cost'
                        type="number"
                        value={ value.cost }
                        onChange={ (e) => handleValueChange({ ...value, cost: Number(e.target.value) }) }
                        className="mt-1 w-full px-3 py-2 border rounded-md"
                        placeholder="R$ 0,00"
                    />
                </div>
                <div className="w-5/12">
                    <label htmlFor='cost' className="text-xs font-medium">Margem de Lucro</label>
                    <input
                        id='profitMargin'
                        name='profitMargin'
                        type="number"
                        value={ marginProfitValue(value) ? marginProfitValue(value) : 0 }
                        className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100"
                        readOnly
                    />
                </div>
            </div>

        </section>
    );
}
