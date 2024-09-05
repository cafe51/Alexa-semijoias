import { StateNewProductType, VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction } from 'react';
import VariationFieldInput from './VariationFieldInput';

interface InputCustomProperties {
    state: StateNewProductType;
    setProductVariationState: Dispatch<SetStateAction<VariationProductType>>;
    productVariationState: VariationProductType;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
    handleProductDefaultPropertyChange: (field: string, value: any) => void;
}

export default function InputCustomProperties({
    state,
    setProductVariationState,
    productVariationState,
    setErrorMessage,
    handleProductDefaultPropertyChange,
}: InputCustomProperties) {
    return (
        <>
            { state.variations.map((variation, index) => (
                <VariationFieldInput
                    key={ index }
                    variation={ variation }
                    productVariationState={ productVariationState }
                    handleProductDefaultPropertyChange={ handleProductDefaultPropertyChange }
                    setProductVariationState={ setProductVariationState }
                    setErrorMessage={ setErrorMessage }

                />
            )) }
        </>
    );
}