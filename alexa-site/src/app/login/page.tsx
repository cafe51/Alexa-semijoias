'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImSpinner9 } from 'react-icons/im';

import { useLogin } from '../hooks/useLogin';
import { useAuthContext } from '../hooks/useAuthContext';



export default function Login() {
    const router = useRouter();
    const { error, login } = useLogin();
    const{ user } = useAuthContext();

    const [loadingButton, setLoadingButton] = useState(true);
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

    useEffect(() => {
    
        try {
            if(user) {
                setLoadingButton(true);
                console.log('user existe no login e é: ', user);
                router.push('/');
            }
        } catch(err) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log('erro desconhecido');
            }
        }
    }, [user, router]);

    const isDisable = () => {
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
        <section className='flex flex-col gap-10 items-center self-center justify-center w-full h-full secColor md:w-2/5'>
            <h1>Entre na sua conta</h1>
            <form 
                className='flex flex-col gap-8' 
                method="post" 
                onSubmit={ handleSubmit }
            >
                <label className={ `flex flex-col gap-1 ${loadingComponent ? 'animate-pulse' : ''}` } htmlFor="email">
                    <span>EMAIL/CPF</span>
                    <input
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
                <label className={ `flex flex-col gap-1 ${loadingComponent ? 'animate-pulse' : ''}` } htmlFor="password">
                    <span>SENHA</span>
                    <input
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

                { loginErrorMessage && (
                    <p className="text-red-600" aria-live="assertive">
                        { loginErrorMessage }
                    </p>
                ) }
                <button
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
            </form>
            { error && <p className='text-red-500'>{ error }</p> }
            <div>
                <p>Não tem uma conta? <a className='text-blue-500' href="/cadastro">Cadastre-se</a></p>
            </div>
        </section>
    );
}
