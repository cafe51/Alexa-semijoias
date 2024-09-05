// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/InputStandardProperties.tsx
import { ProductDefaultPropertiesType, VariationProductType } from '@/app/utils/types';
import CodesSection from '../CodesSection';
import InputField from './InputField';
import { Dispatch, SetStateAction } from 'react';

interface InputStandardPropertiesFormProps {
    sections: string[];
    productDefaultProperties: ProductDefaultPropertiesType
    handleProductDefaultPropertyChange: (field: string, value: any) => void
    productVariationState: VariationProductType;
    totalProductVariationsCreated: number;
    barCodeErrorMessage: string | undefined;
    skuErrorMessage: string | undefined;
    setBarCodeErrorMessage: Dispatch<SetStateAction<string | undefined>>
    setSkuErrorMessage: Dispatch<SetStateAction<string | undefined>>
}
  
export default function InputStandardProperties({
    sections,
    productVariationState,
    totalProductVariationsCreated,
    productDefaultProperties: { barCode, estoque, sku, dimensions, peso },
    handleProductDefaultPropertyChange,
    barCodeErrorMessage,
    skuErrorMessage,
    setBarCodeErrorMessage,
    setSkuErrorMessage,
}: InputStandardPropertiesFormProps) {
    const dimensionProperties = Object.keys(dimensions);

    const estoqueAndPeso = [
        { propertyName: 'estoque', propertyValue: estoque, setProperty: (value: number) => handleProductDefaultPropertyChange('estoque', value) },
        { propertyName: 'peso',propertyValue: peso, setProperty: (value: number) => handleProductDefaultPropertyChange('peso', value) },
    ];

    return(
        <section className='flex flex-col gap-4 bg-gray-100 p-2 w-full rounded-lg'>
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                { estoqueAndPeso.map(({ propertyName, propertyValue, setProperty }, index) => {
                    return (
                        <InputField
                            key={ index }
                            index={ index }
                            propertyName={ propertyName }
                            propertyValue={ propertyValue }
                            setProperty={ setProperty }
                        />
                    );
                }) }
            </div>
            
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                { dimensionProperties.map((property, index) => {
                    return (
                        <InputField
                            key={ index }
                            index={ index }
                            propertyName={ property }
                            propertyValue={ dimensions[property as keyof typeof dimensions] }
                            setProperty={ (input) => handleProductDefaultPropertyChange('dimensions', { ...dimensions, [property]: Number(input) }) }
                        />
                    );
                }) }
            </div>

            <CodesSection
                handleBarcodeChange={ (value: string) => handleProductDefaultPropertyChange('barCode', value) }
                handleSkuChange={ (value: string) => handleProductDefaultPropertyChange('sku', value) }
                sections={ sections }
                barCode={ barCode }
                sku={ sku }
                customProperties={ productVariationState.customProperties }
                totalProductVariationsCreated={ totalProductVariationsCreated }
                barCodeErrorMessage={ barCodeErrorMessage }
                setBarCodeErrorMessage={ setBarCodeErrorMessage }
                setSkuErrorMessage={ setSkuErrorMessage }
                skuErrorMessage={ skuErrorMessage }
            />
        </section>
    );
}
