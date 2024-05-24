'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function NavBarUserSection() {
    const router = useRouter();
    const { user, logout } = useUser();
    const [userIsLogged, setUserIsLogged] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {

        if (user) {
            try {
                setUserIsLogged(true);
                setUserName(user.nome.split(' ')[0]);
            } catch (e) {
                console.error('Invalid JSON in localStorage:', e);
            }  
        } else {
            setUserIsLogged(false);
        }
    }, [router, user]);

    const handleLogOut = () => {
        // localStorage.removeItem('userData');
        logout();
        router.push('/');
    };

    const helloFulana = (
        <div className={ 'flex flex-col bottom-0 fixed font-normal text-sm w-full px-4 py-8  pb-20 secColor' }>
            <span className='text-lg mb-2 font-bold strongTextColored'>Olá, { userName }!</span>
            <div className='flex items-center w-full content-center justify-between '>
                <a href="/minha-conta" className={ 'self-end place-self-end ' }>Minha Conta</a>
                <span className='text-gray-400'>|</span>
                <a onClick={ handleLogOut } href="/" className={ 'self-end place-self-end ' }>Sair</a>
            </div>
        </div>
    );

    const signInSignUp = (
        <div className={ 'flex flex-col bottom-0 fixed font-normal text-sm w-full px-4 py-8 pb-20 secColor' }>
            <div className='flex items-center w-full content-center justify-between '>
                <a href="/cadastro" className={ 'self-end place-self-end ' }>
                    Cadastre-se
                </a>
                <span className='text-gray-400'>|</span>
                <a href="/login" className={ 'self-end place-self-end ' }>
                    Iniciar Sessão
                </a>
            </div>
        </div>
    );
    
    return (
        userIsLogged ? helloFulana : signInSignUp
    );
}