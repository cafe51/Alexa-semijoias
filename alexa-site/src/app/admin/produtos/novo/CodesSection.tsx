// app/admin/dashboard/[adminId]/produtos/novo/CodesSection.tsx
import { getRandomBarCode } from '@/app/utils/getRandomBarCode';
import { getRandomSku } from '@/app/utils/getRandomSku';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface CodesSectionProps {
    sections: string[];
    barCode?: string;
    sku?: string;
    handleSkuChange: (sku: string) => void;
    handleBarcodeChange: (barcode: string) => void;
    customProperties?: { [key: string]: string; };
    totalProductVariationsCreated?: number;
    barCodeErrorMessage?: string | undefined;
    skuErrorMessage?: string | undefined;
    setBarCodeErrorMessage?: Dispatch<SetStateAction<string | undefined>>
    setSkuErrorMessage?: Dispatch<SetStateAction<string | undefined>>
}

export default function CodesSection({
    handleSkuChange,
    sections,
    barCode,
    sku,
    handleBarcodeChange,
    customProperties,
    totalProductVariationsCreated,
    barCodeErrorMessage,
    skuErrorMessage,
    setBarCodeErrorMessage,
    setSkuErrorMessage,
}: CodesSectionProps){
    const [skuGenerateErrorMessage, setSkuGenerateErrorMessage] = useState<string>();

    useEffect(() => {
        if(customProperties) {
            if(sections.length > 0 || Object.values(customProperties).some(pvcp => pvcp === '')) {
                setSkuGenerateErrorMessage(undefined);
            }
        }

    }, [customProperties, sections]);

    const setRandomSku = () => {
        // verificar se há seção vazia
        if(sections.length < 1) {
            setSkuGenerateErrorMessage('Escolha a seção antes de gerar o sku');
            return;
        }

        // verificar se código de barras está vazio
        if(!barCode || barCode.length < 1) {
            setSkuGenerateErrorMessage('Preencha o código de barras antes de gerar o sku');
            return;
        }

        // verificar se alguma propriedade está vazia
        if(customProperties) {
            for (const property in customProperties) {
                if(customProperties[property] === '') {
                    setSkuGenerateErrorMessage(`Preencha ${ property } antes de gerar o sku`);
                    return;
                }
            }
        }

        const skuGenerated = getRandomSku(sections, barCode, customProperties);

        handleSkuChange(skuGenerated);
        setSkuGenerateErrorMessage(undefined);
        setSkuErrorMessage && setSkuErrorMessage(undefined);

    };

    const setRandomBarCode = () => {
        setSkuGenerateErrorMessage(undefined);
        setBarCodeErrorMessage && setBarCodeErrorMessage(undefined);
        const randomBarcode = getRandomBarCode(totalProductVariationsCreated ? totalProductVariationsCreated : 0);
        handleBarcodeChange(randomBarcode);
    };

    const barCodeAndSku = [
        {
            propertyName: 'código de barras',
            propertyValue: barCode ? barCode : '',
            setProperty: handleBarcodeChange,
            setRandom: setRandomBarCode,
        },
        {
            propertyName: 'sku',
            propertyValue: sku ? sku : '',
            setProperty: handleSkuChange,
            setRandom: setRandomSku,
        },
    ];

    return (
        <section className='p-4 border rounded-md bg-white'>
            <h2 className="pb-4">Códigos</h2>

            { barCodeAndSku.map(({ propertyName, propertyValue, setProperty, setRandom }, index) => {
                return (
                    <div key={ index } className='flex flex-col gap-2 w-full'>
                        <label className="text-xs" htmlFor={ propertyName }>{ propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</label>
                        <input
                            className="text-xs px-3 py-2 border rounded-md "
                            id={ propertyName }
                            name={ propertyName }
                            type="text"
                            value={ propertyValue.trim() }
                            onChange={ (e) => {
                                setSkuGenerateErrorMessage(undefined);
                                setProperty(e.target.value);
                                propertyName === 'sku' && setSkuErrorMessage && setSkuErrorMessage(undefined);
                                propertyName === 'código de barras' && setBarCodeErrorMessage && setBarCodeErrorMessage(undefined);
                            } }
                            placeholder=''
                        />
                        <span className='text-xs text-red-500'>{ propertyName === 'sku' && skuGenerateErrorMessage }</span>
                        { skuErrorMessage && <span className='text-xs text-red-500'>{ propertyName === 'sku' && skuErrorMessage }</span> }
                        { barCodeErrorMessage && <span className='text-xs text-red-500'>{ propertyName === 'código de barras' && barCodeErrorMessage }</span> }

                        <button onClick={ () => setRandom() }>Criar { propertyName.charAt(0).toUpperCase() + propertyName.slice(1) }</button>
                    </div>
                );
            }) }
        </section>
    );
}


