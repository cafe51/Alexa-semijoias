// app/cadastro/page.tsx
'use client';
import { useEffect, useState } from 'react';
import RegisterForm from '../components/register/RegisterForm2';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserInfo } from '../hooks/useUserInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingIndicator from '../components/LoadingIndicator';

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
            setLoadingButton(false);

        } catch(err) {
            if (err instanceof Error) {
                console.log(err.message);
            } else {
                console.log('erro desconhecido');
            }
        }
    }, [user, router, userInfo]);

    if(loadingButton) {
        return (
            <LoadingIndicator />
        );
    }   

    return (
        <div className=" bg-[#FAF9F6] flex items-center justify-center px-4 py-16" >
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#333333]">Crie sua conta</CardTitle>
                </CardHeader>
                <CardContent className="max-w-md mx-auto p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg">
                    <RegisterForm/>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-[#333333]">
                Já tem uma conta?{ ' ' }
                        <a href="/login" className="font-medium text-[#C48B9F] hover:text-[#D4AF37]">
                  Faça login
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
