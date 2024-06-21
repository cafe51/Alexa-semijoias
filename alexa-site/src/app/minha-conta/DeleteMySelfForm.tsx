import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDeleteUser } from '../hooks/useDeleteUser';
import { ImSpinner9 } from 'react-icons/im';
import { useLogout } from '../hooks/useLogout';
import { useRouter } from 'next/navigation';

export default function DeleteMySelfForm({ showForm }: { showForm: Dispatch<SetStateAction<boolean>> }) {
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState(true);
    const [loadingComponent, setLoadingComponent] = useState(true);
    const { deleteUserAccount, error: deleteUserError } = useDeleteUser();
    const [tryToDeleteUserState, setTryToDeleteUserState] = useState(false);
    const { logout } = useLogout();

    const [registerValues, setRegisterValues] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        setLoadingButton(false);
        setLoadingComponent(false);
    }, []);


    useEffect(() => {
        console.log('estado atual do tryToDeleteUserState', tryToDeleteUserState);
        console.log('estado atual do deleteUserError', deleteUserError);

        if (tryToDeleteUserState) {
            if (deleteUserError && deleteUserError !== 'ERADO') {
                console.log('não foi possível deletar o usuário', deleteUserError);
            } else {
                console.log('user deleted', deleteUserError);
                logout();
                router.push('/');
            }
        }
    }, [deleteUserError, tryToDeleteUserState]);

    const handleSubmitDeleteMySelf = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingButton(true);

        await deleteUserAccount(registerValues.email, registerValues.password);

        // setDeleteErrorState(deleteUserError);
        setTryToDeleteUserState(true);
        setLoadingButton(false);
    };

    const isDisable = () => {
        const email = registerValues.email.length > 0;
        const password = registerValues.password.length > 0;
        return !(email && password);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterValues({ ...registerValues, [name]: value });
    };

    const closeForm = () => {
        showForm(false);
    };

    return (
        <form 
            className='flex flex-col gap-8 bg-red-400' 
            method="post" 
            onSubmit={ handleSubmitDeleteMySelf }
        >
            <button
                onClick={ closeForm }
                data-testid='close-window-button'
                className='font-extrabold text-4xl absolute self-end p-2'>
                X
            </button>
            <label className={ `px-8 pt-4 flex flex-col gap-1 ${loadingComponent ? 'animate-pulse' : ''}` } htmlFor="email">
                <span>EMAIL/CPF</span>
                <input
                    id="email"
                    type="email"
                    name="email"
                    className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                    placeholder={ loadingComponent ? '' : 'ex: seuemail@email.com' }
                    disabled={ loadingComponent }
                    minLength={ 12 }
                    maxLength={ 28 }
                    onInvalid={ (event) => {
                        const target = event.target as HTMLInputElement;
                        target.setCustomValidity('Por favor, insira um email válido.');
                    } }
                    onInput={ (event) => {
                        const target = event.target as HTMLInputElement;
                        target.setCustomValidity('');
                    } }
                    value={ registerValues.email }
                    onChange={ handleChange }
                />
            </label>
            <label className={ `px-8 flex flex-col gap-1 ${loadingComponent ? 'animate-pulse' : ''}` } htmlFor="password">
                <span>SENHA</span>
                <input
                    id="password"
                    className='w-full p-2 text-xl text-center bg-white rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-pink-400 focus:ring-pink-400 focus:ring-1'
                    type="password"
                    name="password"
                    placeholder={ loadingComponent ? '' : '*******' }
                    disabled={ loadingComponent }
                    minLength={ 6 }
                    maxLength={ 16 }
                    onInvalid={ (event) => {
                        const target = event.target as HTMLInputElement;
                        target.setCustomValidity('Por favor, insira uma senha válida.');
                    } }
                    onInput={ (event) => {
                        const target = event.target as HTMLInputElement;
                        target.setCustomValidity('');
                    } }
                    value={ registerValues.password }
                    onChange={ handleChange }
                />
            </label>
            <div className='px-8 pb-4'>
                { deleteUserError && (
                    <p className="text-white" aria-live="assertive">
                        { deleteUserError }
                    </p>
                ) }
                <button
                    data-testid='delete-button'
                    className={ `${isDisable() || loadingButton ? 'bg-gray-300' : 'bg-green-700'} p-3 text-white flex justify-center text-center rounded w-full shadow-sm` }
                    type="submit"
                    disabled={ isDisable() || loadingButton }
                >
                    { loadingButton ? (
                        <ImSpinner9 className="text-gray-500 animate-spin" />
                    ) : (
                        'Continuar'
                    ) }
                </button>
            </div>
        </form>
    );
}
