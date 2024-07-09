import AddressDetails from './AddressDetails';
import CepDisplay from './CepDisplay';
import ErrorMessage from './ErrorMessage';
import ReadOnlyInputField from './ReadOnlyInputField';

export default function AddressForm({ address, cep, handleCepChange, handleAddressChange, handleFormSubmit, isFormValid, loading, formError }: any) {
    return (
        <div className="flex flex-col p-2 w-full gap-2">
            <CepDisplay cep={ cep } handleCepChange={ handleCepChange } address={ address } />
            <ReadOnlyInputField id="logradouro" value={ address.logradouro } label="Rua" />
            <AddressDetails address={ address } handleAddressChange={ handleAddressChange } />
            { formError && <ErrorMessage message={ formError } /> }
            <button
                onClick={ handleFormSubmit }
                disabled={ loading || !isFormValid() }
                className="bg-yellow-300 p-2 disabled:bg-yellow-100 disabled:text-gray-400"
            >
              Mostrar Estado
            </button>
        </div>
    );
}