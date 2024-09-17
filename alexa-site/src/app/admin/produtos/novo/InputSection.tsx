import { formatInputMode } from '@/app/utils/formatPrice';
import InputField from './VariationSection/InputField';
import { transformTextInputInNumber } from '@/app/utils/transformTextInputInNumber';
import { useState } from 'react';

type PropertyType = { propertyName: string, propertyValue: string, propertyKey: string };

interface InputSectionProps {
    handleChange: (newObjectValue: any, field?: string) => void;
    stateToBeChange: { [key: string]: string | number };
    unitType: 'currency' | 'dimension' | 'weight';
    integer?: boolean;
    labels?: { [key: string]: string };
}

function converteValoresParaString(objeto: {[key: string]: number | string}) {
    const novoObjeto: {[key: string]: string} = {};
    for (const chave in objeto) {
        novoObjeto[chave] = String(objeto[chave]);
    }
  
    return novoObjeto;
}

function convertToProperties(objeto: {[key: string]: string}): PropertyType[] {
    const keys = Object.keys(objeto);
    return keys.map((key) => {
        return { propertyName: key, propertyValue: objeto[key], propertyKey: key };
    });
}

export default function InputSection({ handleChange, stateToBeChange, unitType, integer=false, labels }: InputSectionProps) {
    const [inputValues, setInputValues] = useState(converteValoresParaString(stateToBeChange));

    const handleInputChange = (rawValue: string, propertyKey: string) => {
        const formattedValue = integer ? rawValue : formatInputMode(rawValue, unitType);
        setInputValues((prevValues) => ({
            ...prevValues,
            [propertyKey]: rawValue,
        }));

        if (handleChange.length === 2) {
            // If yes, call it with both the updated object and the field key
            transformTextInputInNumber(formattedValue, (input) => handleChange(input, propertyKey));
        } else {
            // If no, call it with only the updated object
            transformTextInputInNumber(formattedValue, (input) => handleChange({ ...stateToBeChange, [propertyKey]: input }));
        }

    };

    return(
        <>
            {
                convertToProperties(inputValues).map(({ propertyName, propertyValue, propertyKey }) => {
                    return (
                        <InputField
                            key={ propertyKey }
                            propertyKey={ propertyKey } 
                            propertyName={ labels?.[propertyKey] || propertyName }
                            propertyValue={ integer ? propertyValue : formatInputMode(propertyValue, unitType) }
                            onChange={ (e) => handleInputChange(e.target.value, propertyKey) }
                        />
                    );
                })
            }
        </>
    );
}