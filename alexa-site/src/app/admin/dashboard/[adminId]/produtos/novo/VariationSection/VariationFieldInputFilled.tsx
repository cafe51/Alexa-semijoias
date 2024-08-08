import { VariationProductType } from '@/app/utils/types';

interface VariationFieldInputFilledProps {
    productVariation: VariationProductType;
}

export default function VariationFieldInputFilled({ productVariation }: VariationFieldInputFilledProps) {
    const { customProperties, defaultProperties } = productVariation;

    return (
        <div className='flex flex-col gap-2 w-full'>
            <div className='flex gap-2 w-full'>

                {
                    Object.keys(customProperties)
                        .map((property, index) => {
                            if(property in customProperties) {
                                return (
                                    <div className="flex w-5/12" key={ index }>
                                        <div className='flex flex-col gap-2 w-full'>
                                            <label className="text-xs" htmlFor={ property }>{ property.charAt(0).toUpperCase() + property.slice(1) }</label>
                                            <input
                                                className="text-xs self-center px-3 py-2 border rounded-md w-5/6 bg-green-600 text-white"
                                                id={ property }
                                                name={ property }
                                                type={ typeof customProperties[property] === 'number' ? 'number' : 'text' }
                                                value={ customProperties[property as keyof typeof customProperties] }
                                                placeholder=''
                                                readOnly={ true }
    
                                            />
                                        </div>
                                    </div>);
                            }
                        })
                }
            </div>

            <section className='flex flex-col gap-4 bg-green-300 p-2 w-full rounded-lg'>
                <div className='flex flex-col gap-2 w-full py-2 justify-self-start border-t-2 border-green-400 bg-green-300'>
                    <label className="text-xs font-small" htmlFor="estoque">Estoque</label>
                    <input
                        className="text-xs justify-self-start px-3 py-2 border rounded-md w-5/12 bg-green-600 text-white"
                        id="estoque"
                        name="estoque"
                        type="number"
                        value={ defaultProperties.estoque }
                        placeholder=''
                        readOnly={ true }

                    />
                </div>
                <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-green-400 bg-green-300'>

                    { Object.keys(defaultProperties.dimensions)
                        .map((property, index) => {
                            if(property in defaultProperties.dimensions) {
                                return (
                                    <div key={ index } className='flex flex-col gap-2 w-5/12'>
                                        <label className="text-xs" htmlFor={ property }>{ property.charAt(0).toUpperCase() + property.slice(1) }</label>
                                        <input
                                            className="text-xs px-3 py-2 border rounded-md bg-green-600 text-white"
                                            id={ property }
                                            name={ property }
                                            type="number"
                                            value={ defaultProperties.dimensions[property as keyof typeof defaultProperties.dimensions] }
                                            placeholder=''
                                            readOnly={ true }

                                        />
                                    </div>
                                );
                            }
                        }) }
                </div>
                <div className='flex flex-col gap-2 w-full py-2 justify-self-start border-t-2 border-green-400 bg-green-300 '>
                    <label className="text-xs font-small" htmlFor="peso">Peso</label>
                    <input
                        className="text-xs justify-self-start px-3 py-2 border rounded-md w-5/12 bg-green-600 text-white"
                        id="peso"
                        name="peso"
                        type="peso"
                        value={ defaultProperties.peso }
                        placeholder=''
                        readOnly={ true }

                    />
                </div>
            </section>
        </div>

    );
}
