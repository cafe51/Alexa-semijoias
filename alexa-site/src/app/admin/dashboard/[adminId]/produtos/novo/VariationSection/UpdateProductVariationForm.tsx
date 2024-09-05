// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/UpdateProductVariationForm.tsx
import { Dispatch, SetStateAction, useState } from 'react';
import ProductVariationForm from './ProductVariationForm';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import deepEqual from '@/app/utils/deepEqual';

interface UpdateProductVariationFormProps {
  state: StateNewProductType;
  handlers: UseNewProductState;
  productVariation: VariationProductType;
  setEditionProductVariationMode: () => void;
  setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
  errorMessage: string | undefined;
  setSelectedProductVariation: Dispatch<SetStateAction<VariationProductType>>
  barCodeErrorMessage: string | undefined;
  skuErrorMessage: string | undefined;
  setBarCodeErrorMessage: Dispatch<SetStateAction<string | undefined>>
  setSkuErrorMessage: Dispatch<SetStateAction<string | undefined>>
}

export default function UpdateProductVariationForm({
    handlers,
    state,
    productVariation,
    setEditionProductVariationMode,
    setSelectedProductVariation,
    setErrorMessage,
    errorMessage,
    barCodeErrorMessage,
    skuErrorMessage,
    setBarCodeErrorMessage,
    setSkuErrorMessage,
    
}: UpdateProductVariationFormProps) {
    const [newProductVariationState, setNewProductVariationState] = useState<VariationProductType>(productVariation);
    const [isFormValid, setIsFormValid] = useState(false);

    const isThereACodeAlreadyCreated = (codeType: 'barCode' | 'sku') => { 
        const stateDefaultProperties = state.productVariations
            .filter((stateDefaultProperties) => !deepEqual(stateDefaultProperties, productVariation)) // remover o produto editado da comparação
            .map((statePv) => statePv.defaultProperties);
        const createdCodes = stateDefaultProperties.map((stateDefaultProperty) => {
            return stateDefaultProperty[codeType];
        });
        return createdCodes.includes(newProductVariationState.defaultProperties[codeType]);
    };

    const isThereCustomPropertyCombinationAlreadyCreated = () => { 
        const stateCustomProperties = state.productVariations
            .filter((stateCustomProperties) => !deepEqual(stateCustomProperties, productVariation)) // [ { tamanho: 'medio', cor: 'amarelo' }, { tamanho: 'pequeno', cor: 'amarelo' }, ...]
            .map((statePv) => statePv.customProperties);

        console.log('state.productVariations', state.productVariations);
        console.log('stateCustomProperties', stateCustomProperties);
        console.log('newProductVariationState', newProductVariationState);

        const existSameCustomProperty = stateCustomProperties.some((stateCustomProperty) => deepEqual(newProductVariationState.customProperties, stateCustomProperty));
        return existSameCustomProperty;
    };

    const handleUpdateVariation = () => {
        try {
            if (!isFormValid) {
                setErrorMessage('Todos os campos devem estar preenchidos');
                return;
            }

            if(isThereCustomPropertyCombinationAlreadyCreated()) { // verifica se já existe a cp dentro da lista de cp criadas
                setErrorMessage('Já existe um produto salvo com essas propriedades');
                return;
            }

            if(!newProductVariationState.defaultProperties.barCode || newProductVariationState.defaultProperties.barCode.length < 1) {
                setBarCodeErrorMessage('Preencha o código de barras');
                return;
            }

            if(!newProductVariationState.defaultProperties.sku || newProductVariationState.defaultProperties.sku.length < 1) {
                setSkuErrorMessage('Preencha o sku');
                return;
            }

            if(isThereACodeAlreadyCreated('barCode')) {
                setBarCodeErrorMessage('Já existe um produto salvo com esse código de barras');
                return;
            }

            if(isThereACodeAlreadyCreated('sku')) {
                setSkuErrorMessage('Já existe um produto salvo com esse sku');
                return;
            }


            handlers.handleUpdateProductVariation(productVariation, newProductVariationState);
            setSelectedProductVariation(newProductVariationState);
            setEditionProductVariationMode();
        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className="flex p-2 gap-2 rounded-lg border border-solid border-blue-400 w-full">
            <div className="flex flex-col gap-4">
                <ProductVariationForm
                    barCodeErrorMessage={ barCodeErrorMessage }
                    setBarCodeErrorMessage={ setBarCodeErrorMessage }
                    setSkuErrorMessage={ setSkuErrorMessage }
                    skuErrorMessage={ skuErrorMessage }
                    state={ state }
                    productDefaultProperties={ newProductVariationState.defaultProperties }
                    handleProductDefaultPropertyChange={ (field, value) =>
                        setNewProductVariationState(prev => ({
                            ...prev,
                            defaultProperties: { ...prev.defaultProperties, [field]: value },
                        }))
                    }
                    setIsFormValid={ setIsFormValid }
                    productVariationState={ newProductVariationState }
                    setProductVariationState={ setNewProductVariationState }
                    setErrorMessage={ setErrorMessage }
                />
                { errorMessage && <p className="text-xs text-center text-red-500">{ errorMessage }</p> }
            </div>
            <div className="flex flex-col justify-between pr-2 py-2">
                <button className="text-blue-500" onClick={ setEditionProductVariationMode }>
                    <MdCancel size={ 24 } />
                </button>
                <button className="text-green-500" onClick={ handleUpdateVariation }>
                    <FaCheckCircle size={ 24 } />
                </button>
            </div>
        </div>
    );
}
