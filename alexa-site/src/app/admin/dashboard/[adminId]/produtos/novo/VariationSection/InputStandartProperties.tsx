import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

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
    const [skuGenerateErrorMessage, setSkuGenerateErrorMessage] = useState<string>();

    useEffect(() => {
        if(sections.length > 0 || Object.values(productVariationState.customProperties).some(pvcp => pvcp === '')) {
            setSkuGenerateErrorMessage(undefined);
        }

    }, [productVariationState.customProperties, sections]);

    const setRandomBarCode = () => {
        const numeroAleatorio = (Math.floor(Math.random() * 9000) + 1000).toString();
        setBarCode('78902166' + numeroAleatorio + totalProductVariationsCreated);
    };

    const setRandomSku = () => {
        // verificar se há sessão vazia
        if(sections.length < 1) {
            setSkuGenerateErrorMessage('Escolha a sessão antes de gerar o sku');
            return;
        }

        // verificar se alguma propriedade está vazia
        for (const property in productVariationState.customProperties) {
            if(productVariationState.customProperties[property] === '') {
                setSkuGenerateErrorMessage(`Preencha ${ property } antes de gerar o sku`);
                return;
            }
        }

        // verificar se código de barras está vazio
        if(barCode.length < 1) {
            setSkuGenerateErrorMessage('Preencha o código de barras antes de gerar o sku');
            return;
        }

        const sectionsClone = [...sections];
        const sectionNamesForSku = sectionsClone.map((section) => section.slice(0,3)).join('');
        let skuString = sectionNamesForSku;
        for (const property in productVariationState.customProperties) {
            skuString += property.slice(0, 3) + productVariationState.customProperties[property].slice(0, 3);
        }
        
        const skuGenerated = (skuString + barCode.split('78902166')[1]);

        setSku(skuGenerated);
        setSkuGenerateErrorMessage(undefined);

    };

    const estoqueAndPeso = [
        { propertyName: 'estoque', propertyValue: estoque, setProperty: setEstoque },
        { propertyName: 'peso',propertyValue: peso, setProperty: setPeso },
    ];

    const barCodeAndSku = [
        { propertyName: 'código de barras', propertyValue: barCode, setProperty: setBarCode, setRandom: () => {
            setSkuGenerateErrorMessage(undefined);
            setRandomBarCode();
        } },
        { propertyName: 'sku', propertyValue: sku, setProperty: setSku, setRandom: setRandomSku },
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

            <div className='flex flex-col gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                { barCodeAndSku.map(({ propertyName, propertyValue, setProperty, setRandom }, index) => {
                    return (
                        <div key={ index } className='flex flex-col gap-2 w-full'>
                            <label className="text-xs" htmlFor={ propertyName }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
                            <input
                                className="text-xs px-3 py-2 border rounded-md "
                                id={ propertyName }
                                name={ propertyName }
                                type="text"
                                value={ propertyValue }
                                onChange={ (e) => {
                                    setSkuGenerateErrorMessage(undefined);
                                    setProperty(e.target.value);
                                } }
                                placeholder=''
                            />
                            <span className='text-xs text-red-500'>{ propertyName === 'sku' && skuGenerateErrorMessage }</span>
                            <button onClick={ () => setRandom() }>Criar { propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</button>
                        </div>
                    );
                }) }
            </div>
        </section>
    );
}
