// app/cadastro/page.tsx
'use client';
import { useEffect, useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserInfo } from '../hooks/useUserInfo';

export default function Register() {
    const router = useRouter();
    const{ user } = useAuthContext();
    const  { userInfo } = useUserInfo();
    const [loadingButton, setLoadingButton] = useState(true);

    useEffect(() => {
    
        try {
            if(userInfo) {
                setLoadingButton(true);
                console.log('user existe no login e é: ', user);
                router.push('/minha-conta');
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
            <h1>Cadastre-se</h1>
            <RegisterForm
                loadingButton={ loadingButton }
                setLoadingButton={ setLoadingButton }
            />
            <div>
                <p>Já possui uma conta? <a className='text-blue-500' href="/login">Iniciar sessão</a></p>
            </div>
        </section>
    );
}
