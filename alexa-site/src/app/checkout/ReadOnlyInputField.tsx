import InputField from './InputField';

export default function ReadOnlyInputField({ id, value, label }: any) {
    return <InputField id={ id } value={ value } label={ label } readOnly={ true } />;
}