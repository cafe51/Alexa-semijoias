// app/checkout/AddressSection/ReadOnlyInputField.tsx

import InputField from './InputField';

export default function ReadOnlyInputField({ id, value, label }: { id: string; value: string; label: string }) {
    return <InputField id={ id } value={ value } label={ label } readOnly={ true } />;
}