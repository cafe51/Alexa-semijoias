//app/components/LoginForm.tsx
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import InputField from '../checkout/AddressSection/InputField';
import { useLogin } from '../hooks/useLogin';
import LargeButton from './LargeButton';

interface LoginFormProps {
    loadingButton: boolean
    setLoadingButton: Dispatch<SetStateAction<boolean>>
    onClick: () => void;
}

export default function LoginForm({ loadingButton, setLoadingButton, onClick } : LoginFormProps) {
    const { error, login } = useLogin();
    const [loadingComponent, setLoadingComponent] = useState(true);
    const [loginErrorMessage, setLoginErrorMessage] = useState('');
    const [registerValues, setRegisterValues] = useState({
        email: '',
        password: '',
    });

    useEffect(() => {
        setLoadingButton(false);
        setLoadingComponent(false);
    }, []);

    const isButtonDisabled = () => {
        const email = registerValues.email.length > 0;
        const password = registerValues.password.length > 0;
        return !(email && password);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterValues({ ...registerValues, [name]: value });
    };

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingButton(true);
        setLoginErrorMessage('');

        try {
            login(registerValues.email, registerValues.password);

        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log('erro desconhecido');
            }
            setLoginErrorMessage('Usuário ou senha inválidos');
        } finally {
            setLoadingButton(false);
        }
    };

    return (
        <form 
            className='flex flex-col gap-4 items-center' 
            method="post" 
            onSubmit={ handleSubmit }
        >
            <InputField
                id='email'
                type="email"
                label={ loadingComponent ? '' : 'Email' }
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
            <InputField
                id='password'
                type="password"
                label={ loadingComponent ? '' : 'Senha' }
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

            { loginErrorMessage && (
                <p className="text-red-600" aria-live="assertive">
                    { loginErrorMessage }
                </p>
            ) }
            <LargeButton color='green' disabled={ isButtonDisabled() } loadingButton={ loadingButton } onClick={ onClick }>
                Continuar
            </LargeButton>
            { error && <p className='text-red-500'>{ error }</p> }

        </form>
    );
}