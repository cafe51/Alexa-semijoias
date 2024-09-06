// app/admin/dashboard/[adminId]/produtos/novo/PricesSection.tsx

import { formatCurrencyInputMode } from '@/app/utils/formatPrice';
import { marginProfitValue } from '@/app/utils/marginProfitValue';
import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { StateNewProductType } from '@/app/utils/types';
import { useState, useMemo } from 'react';



interface PricesSectionProps {
    state: StateNewProductType;
    handleValueChange: (value: { price: number, promotionalPrice: number, cost: number, }) => void;
}

export default function PricesSection({ state: { value }, handleValueChange }: PricesSectionProps) {
    const [inputValues, setInputValues] = useState({
        price: value.price.toString(),
        promotionalPrice: value.promotionalPrice.toString(),
        cost: value.cost.toString(),
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, propertyKey: string) => {
        const { value: rawValue } = e.target;
        const formattedValue = formatCurrencyInputMode(rawValue);
        setInputValues((prevValues) => ({
            ...prevValues,
            [propertyKey]: rawValue,
        }));

        transformTextInputInNumber(formattedValue, (input) => handleValueChange({ ...value, [propertyKey]: input }));
    };

    const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
    const marginProfit = useMemo(() => marginProfitValue(value) ? marginProfitValue(value).toFixed(2) + ' %' : '0 %', [value]);

    const prices = [
        { propertyName: 'preço de venda', propertyValue: inputValues.price, propertyKey: 'price' },
        { propertyName: 'preço promocional', propertyValue: inputValues.promotionalPrice, propertyKey: 'promotionalPrice' },
        { propertyName: 'custo', propertyValue: inputValues.cost, propertyKey: 'cost' },
    ];

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold p-2">Preços</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>

                { prices.map(({ propertyName, propertyValue, propertyKey }) => {
                    return (
                        <div key={ propertyKey } className='flex flex-col gap-2 w-5/12'>
                            <label className="text-xs" htmlFor={ propertyKey }>{ capitalize(propertyName) }</label>
                            <input
                                className="text-xs px-3 py-2 border rounded-md"
                                id={ propertyKey }
                                name={ propertyKey }
                                type="text"
                                value={ formatCurrencyInputMode(propertyValue) }
                                onChange={ (e) => handleInputChange(e, propertyKey) }
                                placeholder=''
                                aria-label={ `Insira o ${propertyName}` }
                            />
                        </div>
                    );
                }) }

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
