import { StateNewProductType, VariationProductType } from '@/app/utils/types';
import { Dispatch, SetStateAction } from 'react';
import VariationFieldInput from './VariationFieldInput';

interface InputCustomProperties {
    state: StateNewProductType;
    productVariationState: VariationProductType;
    setErrorMessage: Dispatch<SetStateAction<string | undefined>>;
    handleProductDefaultPropertyChange: (value: any, field: string) => void;
    handleProductCustomPropertyChange: (value: string, field: string) => void;
}

export default function InputCustomProperties({
    state,
    handleProductCustomPropertyChange,
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
                    handleProductCustomPropertyChange={ handleProductCustomPropertyChange }
                    setErrorMessage={ setErrorMessage }

                />
            )) }
        </>
    );
}