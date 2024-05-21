'use client';

import { useEffect, useState } from 'react';
import BodyWithHeaderAndFooter from '../components/BodyWithHeaderAndFooter';
import { useRouter } from 'next/navigation';
import { ImSpinner9 } from 'react-icons/im';


export default function Login() {
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState(true);
    const [loadingComponent, setLoadingComponent] = useState(true);
    const [loginErrorMessage, setLoginErrorMessage] = useState(false);
    const [registerValues, setRegisterValues] = useState({
        email: '',
        password: '',
    });


    useEffect(() => {
        setLoadingButton(false);
        setLoadingComponent(false);
        
    }, []);

    useEffect(() => {
        const userFromLocalStorage = localStorage.getItem('userData');
        const userData = userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
        if (userData && userData.token) {
            setLoadingButton(true);
            router.push('blogapi/');
        }
    
    });

    const isDisable = () => {
        const email = registerValues.email.length > 0;
        const password = registerValues.password.length > 0;
        const properties = [email, password];
        return !properties.every(property => property);
    };
    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setRegisterValues({ ...registerValues, [name]: value });
    };
    
    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            setLoadingButton(true);
            // const { token } = await loginRequestApi(registerValues);
            // const allUsers = await getUsersApi(token);
            // const user = allUsers.find((myUser: UserType) => myUser.email === registerValues.email);
            // const userData = { user, token };
            // localStorage.setItem('userData', JSON.stringify(userData));


            router.push('/blogapi');

        } catch(error) {
            console.log('erro no login: ', error);

            setLoginErrorMessage(true);
        } finally {
            setLoadingButton(false);
        }

    };

    return (
        <BodyWithHeaderAndFooter>
            <section className='flex flex-col gap-10 items-center self-center justify-center w-full h-full secColor  md:w-2/5'>
                <h1>Entre na sua conta</h1>
                <form 
                    className='flex flex-col gap-8 '
                    method="post"
                    onSubmit={ (e) => handleSubmit(e) }
                >
                    <label className={ `flex flex-col gap-1 ${loadingComponent ? 'animate-pulse' : ''}` } htmlFor="email">
                        <span>EMAIL/CPF</span>
                        <input
                            type="email"
                            name="email"
                            className='
                            w-full
                            p-2
                            text-xl
                            text-center
                            bg-white
                            rounded-md
                            py-2 
                            pl-9
                            pr-3
                            shadow-sm
                            focus:outline-none
                            focus:border-pink-400
                            focus:ring-pink-400
                            focus:ring-1 
                            '
                            placeholder={ `${loadingComponent ? '' : 'ex: seuemail@email.com'}` }
                            disabled={ loadingComponent }
                            minLength={ 12 }
                            maxLength={ 28 }
                            onInvalid={ event => {
                                const target = event.target as HTMLInputElement;
                                target.setCustomValidity('Por favor, insira um email válido.');
                            } }
                            onInput={ event => {
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
                            className='
                            w-full
                            p-2
                            text-xl
                            text-center
                            bg-white
                            rounded-md
                            py-2
                            pl-9
                            pr-3
                            shadow-sm
                            focus:outline-none
                            focus:border-pink-400
                            focus:ring-pink-400
                            focus:ring-1 
                            '
                            type="password"
                            name="password"
                            placeholder={ `${loadingComponent ? '' : '*******'}` }
                            disabled={ loadingComponent }
                            minLength={ 6 }
                            maxLength={ 16 }
                            onInvalid={ event => {
                                const target = event.target as HTMLInputElement;
                                target.setCustomValidity('Por favor, insira uma senha válida.');
                            } }
                            onInput={ event => {
                                const target = event.target as HTMLInputElement;
                                target.setCustomValidity('');
                            } }
                            value={ registerValues.password }
                            onChange={ handleChange }
                            
                        />
                    </label>

                    { loginErrorMessage && (
                        <p
                            className="text-red-600"
                        >
            Usuário ou senha inválidos
                        </p>
                    ) }
                    <button
                        className={ `${ isDisable() || loadingButton ? 'bg-gray-300 ' : 'bg-green-700 ' }p-3 text-white flex justify-center text-center rounded w-full shadow-sm` }
                        type="submit"
                        disabled={ isDisable() }
                    >
                        { loadingButton ? (
                            < ImSpinner9 className="text-gray-500 animate-spin"/>
                        ) : (
                            'Continuar'
                        ) }
                    </button>
                </form>
                <div>
                    <p>Não tem uma conta? <a className='text-blue-500' href="/blogapi/signup">Cadastre-se</a></p>
                </div>
            </section>
        </BodyWithHeaderAndFooter>
    );
}