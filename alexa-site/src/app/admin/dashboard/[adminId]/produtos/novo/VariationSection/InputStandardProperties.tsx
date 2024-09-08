// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/InputStandardProperties.tsx
import { ProductDefaultPropertiesType, VariationProductType } from '@/app/utils/types';
import CodesSection from '../CodesSection';
import { Dispatch, SetStateAction } from 'react';
import InputSection from '../InputSection';

interface InputStandardPropertiesFormProps {
    sections: string[];
    productDefaultProperties: ProductDefaultPropertiesType
    handleProductDefaultPropertyChange: (value: any, field: string) => void
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
    
    return(
        <section className='flex flex-col gap-4 bg-gray-100 p-2 w-full rounded-lg'>
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                <InputSection
                    handleChange={ (value: any, field: string | undefined) => handleProductDefaultPropertyChange(value, field!) }
                    stateToBeChange={ { estoque } }
                    unitType='weight'
                    integer
                />

                <InputSection
                    handleChange={ (value: any, field: string | undefined) => handleProductDefaultPropertyChange(value, field!) }
                    stateToBeChange={ { peso } }
                    unitType='weight'
                />
            </div>
            
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                <InputSection
                    handleChange={  (input, field) => handleProductDefaultPropertyChange({ ...dimensions, [field!]: input }, 'dimensions') }
                    stateToBeChange={ dimensions }
                    unitType='dimension'

                />
            </div>

            <CodesSection
                handleBarcodeChange={ (value: string) => handleProductDefaultPropertyChange(value, 'barCode') }
                handleSkuChange={ (value: string) => handleProductDefaultPropertyChange(value, 'sku') }
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
