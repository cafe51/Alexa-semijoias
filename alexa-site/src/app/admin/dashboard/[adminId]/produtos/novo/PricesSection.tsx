// app/admin/dashboard/[adminId]/produtos/novo/PricesSection.tsx

import marginProfitValue from '@/app/utils/marginProfitValue';
import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { StateNewProductType } from '@/app/utils/types';

interface PricesSectionProps {
    state: StateNewProductType;
    handleValueChange: (value: { price: number, promotionalPrice: number, cost: number, }) => void;
}

export default function PricesSection({ state: { value }, handleValueChange } : PricesSectionProps){

    const prices = [
        { propertyName: 'preço de venda', propertyValue: value.price, propertyKey: 'price' },
        { propertyName: 'preço promocional', propertyValue: value.promotionalPrice, propertyKey: 'promotionalPrice' },
        { propertyName: 'custo', propertyValue: value.cost, propertyKey: 'cost' },
    ];

    return (
        <section className="flex flex-col gap-2 p-2 py-4 border rounded-md bg-white w-full">
            <h2 className="font-bold p-2">Preços</h2>
            <div className='flex flex-wrap justify-center w-full gap-4 text-xs'>

                { prices.map(({ propertyName, propertyValue, propertyKey }) => {
                    return (
                        <div key={ propertyKey } className='flex flex-col gap-2 w-5/12'>
                            <label className="text-xs" htmlFor={ propertyKey }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
                            <input
                                className="text-xs px-3 py-2 border rounded-md"
                                id={ propertyKey }
                                name={ propertyKey }
                                type="text"
                                value={ propertyValue }
                                onChange={ (e) => {
                                    transformTextInputInNumber(e.target.value, (input) => handleValueChange({ ...value, [propertyKey]: input }));
                                }
                                }
                                placeholder=''
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
                        value={ marginProfitValue(value) ? marginProfitValue(value).toFixed(2) + ' %' : 0 + ' %' }
                        readOnly
                    />
                </div>
            </div>

        </section>
    );
}
