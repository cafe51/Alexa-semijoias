// app/admin/dashboard/[adminId]/produtos/novo/PricesSection.tsx
import { marginProfitValue } from '@/app/utils/marginProfitValue';
import { StateNewProductType } from '@/app/utils/types';
import { useEffect, useMemo, useState } from 'react';
import InputSection from './InputSection';

interface PricesSectionProps {
    state: StateNewProductType;
    handleValueChange: (value: { price: number, promotionalPrice: number, cost: number, }) => void;
}

export default function PricesSection({ state: { value }, handleValueChange }: PricesSectionProps) {
    const [pricesState, setPricesState] = useState({
        ['preço']: value && value.price ? value.price : 0,
        ['preço promocional']: value && value.promotionalPrice ? value.promotionalPrice : 0,
        custo: value && value.cost ? value.cost : 0,
    });

    useEffect(() => {
        if(value) {
            setPricesState({
                ['preço']: value && value.price ? value.price : 0,
                ['preço promocional']: value && value.promotionalPrice ? value.promotionalPrice : 0,
                custo: value && value.cost ? value.cost : 0,
            });
        }
    }, [value]);

    const marginProfit = useMemo(() => marginProfitValue(value) ? marginProfitValue(value).toFixed(2) + ' %' : '0 %', [value]);

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold p-2">Preços</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>

                <InputSection handleChange={ handleValueChange } stateToBeChange={ pricesState } unitType='currency'/>

                <div className="flex flex-col gap-2 w-5/12">
                    <label htmlFor='profitMargin' className="text-xs font-medium">Margem de Lucro</label>
                    <input
                        className="text-xs px-3 py-2 border rounded-md"
                        id='profitMargin'
                        name='profitMargin'
                        type="text"
                        value={ marginProfit }
                        readOnly
                        aria-label="Margem de Lucro"
                    />
                </div>
            </div>

        </section>
    );
}