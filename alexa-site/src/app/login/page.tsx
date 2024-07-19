//app/login/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserInfo } from '../hooks/useUserInfo';
import LoginForm from '../components/LoginForm';

export default function Login() {
    const router = useRouter();
    const [loadingButton, setLoadingButton] = useState(true);

    
    const{ user } = useAuthContext();
    const  { userInfo } = useUserInfo();

    useEffect(() => {
    
        try {
            if(userInfo) {
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
    }, [user, router, userInfo]);


    return (
        <section className='flex flex-col gap-10 items-center self-center justify-center w-full h-full secColor md:w-2/5'>
            <h1>Entre na sua conta</h1>
            <LoginForm loadingButton={ loadingButton } setLoadingButton={ setLoadingButton }/>
            <div>
                <p>Não tem uma conta? <a className='text-blue-500' href="/cadastro">Cadastre-se</a></p>
            </div>
        </section>
    );
}
