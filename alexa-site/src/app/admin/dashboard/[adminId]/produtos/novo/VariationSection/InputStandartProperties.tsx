import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction } from 'react';
import CodesSection from '../CodesSection';

interface InputStandartPropertiesFormProps {
    sections: string[];
    productVariationState: VariationProductType;
    totalProductVariationsCreated: number;
    estoque: number;
    setEstoque: Dispatch<SetStateAction<number>>;
    peso: number;
    setPeso: Dispatch<SetStateAction<number>>;
    sku: string;
    setSku: Dispatch<SetStateAction<string>>;
    barCode: string;
    setBarCode: Dispatch<SetStateAction<string>>;
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
  

export default function InputStandartProperties({
    sections,
    productVariationState,
    totalProductVariationsCreated,
    estoque,
    setEstoque,
    dimensions,
    peso,
    setDimensions,
    setPeso,
    sku,
    setSku,
    barCode,
    setBarCode,
}: InputStandartPropertiesFormProps) {
    const dimensionProperties = Object.keys(dimensions);



    const estoqueAndPeso = [
        { propertyName: 'estoque', propertyValue: estoque, setProperty: setEstoque },
        { propertyName: 'peso',propertyValue: peso, setProperty: setPeso },
    ];

    return(
        <section className='flex flex-col gap-4 bg-gray-100 p-2 w-full rounded-lg'>
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                { estoqueAndPeso.map(({ propertyName, propertyValue, setProperty }, index) => {
                    return (
                        <div key={ index } className='flex flex-col gap-2 w-5/12'>
                            <label className="text-xs" htmlFor={ propertyName }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
                            <input
                                className="text-xs px-3 py-2 border rounded-md "
                                id={ propertyName }
                                name={ propertyName }
                                type="text"
                                value={ propertyValue }
                                onChange={ (e) => transformTextInputInNumber(e.target.value, setProperty) }
                                placeholder=''
                            />
                        </div>
                    );
                }) }
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

            <CodesSection
                handleBarcodeChange={ setBarCode }
                handleSkuChange={ setSku }
                sections={ sections }
                barCode={ barCode }
                sku={ sku }
                customProperties={ productVariationState.customProperties }
                totalProductVariationsCreated={ totalProductVariationsCreated }
            />
        </section>
    );
}
