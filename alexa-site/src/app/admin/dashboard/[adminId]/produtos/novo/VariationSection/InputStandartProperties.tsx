import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { Dispatch, SetStateAction } from 'react';

interface InputStandartPropertiesFormProps {
    estoque: number;
    setEstoque: Dispatch<SetStateAction<number>>;
    peso: number;
    setPeso: Dispatch<SetStateAction<number>>;
    dimensions: {
      altura: number;
      largura: number;
      comprimento: number;
  }
    setDimensions: Dispatch<SetStateAction<{
      altura: number;
      largura: number;
      comprimento: number;
  }>>
}
  

export default function InputStandartProperties({ estoque, setEstoque, dimensions, peso, setDimensions, setPeso }: InputStandartPropertiesFormProps) {
    const dimensionProperties = Object.keys(dimensions);
    return(
        <section className='flex flex-col gap-4 bg-gray-100 p-2 w-full rounded-lg'>
            <div className='flex flex-col gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                <label className="text-xs font-small" htmlFor="estoque">Estoque</label>
                <input
                    className="text-xs justify-self-start px-3 py-2 border rounded-md w-5/12"
                    id="estoque"
                    name="estoque"
                    type="text"
                    value={ estoque }
                    onChange={ (e) => transformTextInputInNumber(e.target.value, setEstoque) }
                    placeholder=''
                />
            </div>

            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                { dimensionProperties.map((property, index) => {
                    if(property in dimensions) {
                        return (
                            <div key={ index } className='flex flex-col gap-2 w-5/12'>
                                <label className="text-xs" htmlFor={ property }>{ property.charAt(0).toUpperCase() + property.slice(1) }</label>
                                <input
                                    className="text-xs px-3 py-2 border rounded-md "
                                    id={ property }
                                    name={ property }
                                    type="text"
                                    value={ dimensions[property as keyof typeof dimensions] }
                                    onChange={ (e) => transformTextInputInNumber(e.target.value, (input) => setDimensions({ ...dimensions, [property]: Number(input)  })) }
                                    placeholder=''
                                />
                            </div>
                        );
                    }
                }) }
            </div>

            <div className='flex flex-col gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                <label className="text-xs font-small" htmlFor="peso">Peso</label>
                <input
                    className="text-xs justify-self-start px-3 py-2 border rounded-md w-5/12"

                    id="peso"
                    name="peso"
                    type="text"
                    value={ peso }
                    onChange={ (e) => transformTextInputInNumber(e.target.value, setPeso) }
                    placeholder=''
                />
            </div>
        </section>
    );
}
