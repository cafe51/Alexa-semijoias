// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/CreateNewProductVariationForm.tsx
import { Dispatch, SetStateAction, useState } from 'react';
import LargeButton from '@/app/components/LargeButton';
import ProductVariationForm from './ProductVariationForm';
import { ProductDefaultPropertiesType, ProductVariationsType, StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';
import deepEqual from '@/app/utils/deepEqual';
import { useCollection } from '@/app/hooks/useCollection';

const emptyInitialProductDefaultPropertiesState: ProductDefaultPropertiesType = {
    estoque: 0,
    peso: 0,
    dimensions: { altura: 0, largura: 0, comprimento: 0 },
    sku: '',
    barCode: '',
    imageIndex: 0,
};

interface CreateNewProductVariationFormProps {
    state: StateNewProductType;
    handlers: UseNewProductState;
    setProductVariationState: Dispatch<SetStateAction<VariationProductType>>
    productVariationState: VariationProductType;
    toggleVariationEditionModal?: () => void | undefined
}

export default function CreateNewProductVariationForm({
    state,
    handlers,
    productVariationState,
    setProductVariationState,
    toggleVariationEditionModal,

}: CreateNewProductVariationFormProps) {
    const [productDefaultProperties, setProductDefaultProperties] = useState<ProductDefaultPropertiesType>(emptyInitialProductDefaultPropertiesState);
    const [errorMessage, setErrorMessage] = useState<string>();
    const [barCodeErrorMessage, setBarCodeErrorMessage] = useState<string>();
    const [skuErrorMessage, setSkuErrorMessage] = useState<string>();
    const [isFormValid, setIsFormValid] = useState(false);
    const { getAllDocuments: getAllProductVariationsFromFirebase } = useCollection<ProductVariationsType>('productVariations');

    const handleProductDefaultPropertyChange = (value: string, field: string) => {
        setProductDefaultProperties(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };

    const handleProductCustomPropertyChange = (value: string, field: string) => {
        setProductVariationState((prevState) => ({
            ...prevState,
            customProperties: {
                ...prevState.customProperties,
                [field]: value.trim().toLowerCase(),
            },
        }));
    };

    const isThereACodeAlreadyCreated = (codeType: 'barCode' | 'sku') => { 
        const stateDefaultProperties = state.productVariations.map((statePv) => statePv.defaultProperties);
        const createdCodes = stateDefaultProperties.map((stateDefaultProperty) => {
            return stateDefaultProperty[codeType];
        });
        return createdCodes.includes(productDefaultProperties[codeType]);
    };

    const isThereACodeInTheFireStore = async(codeType: 'barCode' | 'sku') => { 
        const docsInFirestore = await getAllProductVariationsFromFirebase([{ field: codeType, operator: '==', value: productDefaultProperties[codeType] }]);
        return docsInFirestore.length > 0;

    };

    const isThereCustomPropertyCombinationAlreadyCreated = () => { 
        const stateCustomProperties = state.productVariations.map((statePv) => statePv.customProperties); // [ { tamanho: 'medio', cor: 'amarelo' }, { tamanho: 'pequeno', cor: 'amarelo' }, ...]
        for (const property in productVariationState.customProperties) {
            productVariationState.customProperties[property] = productVariationState.customProperties[property].trim().toLowerCase();
        }
        const existSameCustomProperty = stateCustomProperties.some((stateCustomProperty) => deepEqual(productVariationState.customProperties, stateCustomProperty));
        return existSameCustomProperty;
    };

    const handleSaveVariation = async() => {
        try {
            if (!isFormValid) {
                setErrorMessage('Todos os campos devem estar preenchidos');
                throw new Error('Todos os campos devem estar preenchidos');
            }

            if(isThereCustomPropertyCombinationAlreadyCreated()) { // verifica se já existe a cp dentro da lista de cp criadas
                setErrorMessage('Já existe um produto salvo com essas propriedades');
                return;
            }

            if(!productDefaultProperties.barCode || productDefaultProperties.barCode.length < 1) {
                setBarCodeErrorMessage('Preencha o código de barras');
                return;
            }

            if(!productDefaultProperties.sku || productDefaultProperties.sku.length < 1) {
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

            if(await isThereACodeInTheFireStore('barCode')) {
                setBarCodeErrorMessage('Já existe um produto salvo no banco de dados com esse código de barras');
                return; 
            }

            if(await isThereACodeInTheFireStore('sku')) {
                setSkuErrorMessage('Já existe um produto salvo no banco de dados com esse sku');
                return;
            }

            for (const property in productVariationState.customProperties) {
                productVariationState.customProperties[property] = productVariationState.customProperties[property].trim().toLowerCase();
            }

            handlers.handleAddProductVariation({ ...productVariationState, defaultProperties: productDefaultProperties });

            setProductVariationState((prevState) => {
                const resetCustomProperties = { ...prevState.customProperties };
                for (const property in prevState.customProperties) {
                    resetCustomProperties[property] = '';
                }
                return { customProperties: resetCustomProperties, defaultProperties: emptyInitialProductDefaultPropertiesState };
            });
            
            handlers.handleStockQuantityChange(undefined);
            setProductDefaultProperties(emptyInitialProductDefaultPropertiesState);
            toggleVariationEditionModal && toggleVariationEditionModal();

        } catch(error) {
            console.error(error);
        }
    };

    return (
        <div className='w-full flex flex-col gap-2 mt-2'>
            <ProductVariationForm
                state={ state }
                setIsFormValid={ setIsFormValid }
                productVariationState={ productVariationState }
                handleProductCustomPropertyChange={ handleProductCustomPropertyChange }
                productDefaultProperties={ productDefaultProperties }
                handleProductDefaultPropertyChange={ handleProductDefaultPropertyChange }
                setErrorMessage={ setErrorMessage }
                barCodeErrorMessage={ barCodeErrorMessage }
                setBarCodeErrorMessage={ setBarCodeErrorMessage }
                setSkuErrorMessage={ setSkuErrorMessage }
                skuErrorMessage={ skuErrorMessage }
            />
            { errorMessage && <p className='text-sm text-center justify-self-center text-red-500'>{ errorMessage }</p> }
            <LargeButton
                color='blue'
                disabled={ !isFormValid }
                loadingButton={ false }
                onClick={ handleSaveVariation }>
                  Salvar variação
            </LargeButton>
        </div>
    );
}