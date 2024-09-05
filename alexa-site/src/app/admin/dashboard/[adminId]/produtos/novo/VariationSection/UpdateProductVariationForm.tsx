// app/admin/dashboard/[adminId]/produtos/novo/VariationSection/UpdateProductVariationForm.tsx
import { Dispatch, SetStateAction, useState } from 'react';
import ProductVariationForm from './ProductVariationForm';
import { FaCheckCircle } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { StateNewProductType, UseNewProductState, VariationProductType } from '@/app/utils/types';

interface UpdateProductVariationFormProps {
  state: StateNewProductType;
  handlers: UseNewProductState;
  productVariation: VariationProductType;
  setEditionProductVariationMode: () => void;
  setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
  errorMessage: string | undefined;
}

export default function UpdateProductVariationForm({
    handlers,
    state,
    productVariation,
    setEditionProductVariationMode,
    setErrorMessage,
    errorMessage,
}: UpdateProductVariationFormProps) {
    const [newProductVariationState, setNewProductVariationState] = useState<VariationProductType>(productVariation);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleUpdateVariation = () => {
        if (!isFormValid) {
            setErrorMessage('Todos os campos devem estar preenchidos');
            return;
        }

        handlers.handleUpdateProductVariation(productVariation, newProductVariationState);
        setEditionProductVariationMode();
    };

    return (
        <div className="flex p-2 gap-2 rounded-lg border border-solid border-blue-400 w-full">
            <div className="flex flex-col gap-4">
                <ProductVariationForm
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
                <button className="text-green-500" disabled={ !isFormValid } onClick={ handleUpdateVariation }>
                    <FaCheckCircle size={ 24 } />
                </button>
            </div>
        </div>
    );
}
