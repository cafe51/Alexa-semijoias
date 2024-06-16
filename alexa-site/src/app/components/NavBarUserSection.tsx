//app/components/NavBarUserSection.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import { useCollection } from '../hooks/useCollection';
import { useLogout } from '../hooks/useLogout';
import { useUserInfo } from '../hooks/useUserInfo';

export default function NavBarUserSection() {
    const router = useRouter();
    const{ user } = useAuthContext();
    const { documents } = useCollection('usuarios', null);
    const { logout } = useLogout();

    const [userIsLogged, setUserIsLogged] = useState(false);
    const userInfo = useUserInfo()?.userInfo;

    useEffect(() => {
        try {
            if(user) {
                setUserIsLogged(true);
            } else {
                setUserIsLogged(false);
            }
        } catch(err) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log('erro desconhecido');
            }
        }
    }, [documents, user]);

    const handleLogOut = () => {
        logout();
        router.push('/');
    };

    const helloFulana = (
        <div className={ 'flex flex-col bottom-0 fixed font-normal text-sm w-full px-4 py-8  pb-20 secColor' }>
            <span className='text-lg mb-2 font-bold strongTextColored'>Olá, { userInfo?.nome }!</span>
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