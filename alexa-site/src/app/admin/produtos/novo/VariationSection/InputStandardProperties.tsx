// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/InputStandardProperties.tsx
import { ImageProductDataType, ProductDefaultPropertiesType, StateNewProductType, VariationProductType } from '@/app/utils/types';
import CodesSection from '../CodesSection';
import { Dispatch, SetStateAction, useState } from 'react';
import InputSection from '../InputSection';
import ChooseImage from './ChooseImage';

interface InputStandardPropertiesFormProps {
    state: StateNewProductType;
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
    state,
    productVariationState,
    totalProductVariationsCreated,
    productDefaultProperties: { barCode, estoque, sku, dimensions, peso, imageIndex },
    handleProductDefaultPropertyChange,
    barCodeErrorMessage,
    skuErrorMessage,
    setBarCodeErrorMessage,
    setSkuErrorMessage,
}: InputStandardPropertiesFormProps) {
    const [showChooseImageModel, setShowChooseImageModel] = useState<boolean>(false);

    function handleImageChange(foundedImage: ImageProductDataType | undefined) {
        handleProductDefaultPropertyChange(foundedImage ? foundedImage.index : 0, 'imageIndex');
    }
    console.log('AAAAAAAAAAAAAAA', typeof peso, typeof (Number(peso).toFixed(2))); console;
    
    return(
        <section className='flex flex-col gap-4 bg-gray-100 p-2 w-full rounded-lg'>
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                <ChooseImage
                    images={ state.images }
                    imageIndex={ imageIndex }
                    showChooseImageModel={ showChooseImageModel }
                    handleImageChange={ handleImageChange }
                    setShowChooseImageModel={ setShowChooseImageModel }
                />
                <InputSection
                    handleChange={ (value: any, field: string | undefined) => handleProductDefaultPropertyChange(value, field!) }
                    stateToBeChange={ { estoque } }
                    integer
                />

                <InputSection
                    handleChange={ (value: any, field: string | undefined) => handleProductDefaultPropertyChange(value, field!) }
                    stateToBeChange={ { peso: (peso).toFixed(2) } }
                />
            </div>
            
            <div className='flex flex-wrap gap-2 w-full py-2 justify-self-start border-t-2 border-gray-200'>
                <InputSection
                    handleChange={  (input, field) => handleProductDefaultPropertyChange({ ...dimensions, [field!]: input }, 'dimensions') }
                    stateToBeChange={ {
                        altura: dimensions.altura * 100,
                        largura: dimensions.largura * 100,
                        comprimento: dimensions.comprimento * 100,
                    } }
                />
            </div>

            <CodesSection
                handleBarcodeChange={ (value: string) => handleProductDefaultPropertyChange(value, 'barCode') }
                handleSkuChange={ (value: string) => handleProductDefaultPropertyChange(value, 'sku') }
                sections={ state.sections }
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
