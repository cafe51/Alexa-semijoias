// app/cadastro/page.tsx
'use client';
import { useEffect, useState } from 'react';
import RegisterForm from '../components/register/RegisterForm2';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '../hooks/useUserInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingIndicator from '../components/LoadingIndicator';
import EmailVerification from '../components/EmailVerification';

export default function Register() {
    const [signedEmail, setSignedEmail] = useState<string | undefined>(undefined);
    const router = useRouter();
    const  { userInfo } = useUserInfo();

    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, [userInfo, router]);

    if (userInfo === null || userInfo) {
        return <LoadingIndicator />; 
    }

    return (
        <div className=" bg-[#FAF9F6] flex items-center justify-center px-4 py-2 md:py-4 lg:py-8" >
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="text-center m-0 pb-2">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#333333] p-0 m-0">Crie sua conta</CardTitle>
                </CardHeader>
                <CardContent className="max-w-md mx-auto rounded-lg">
                    { signedEmail ? (
                        <EmailVerification
                            email={ signedEmail }
                        />
                    ) : (
                        <RegisterForm setSignedEmail={ (email) => setSignedEmail(email) }/>
                    ) }
                    
                </CardContent>
                { !signedEmail && (
                    <CardFooter className="text-center">
                        <p className="text-sm text-[#333333]">
                Já tem uma conta?{ ' ' }
                            <a href="/login" className="font-medium text-[#C48B9F] hover:text-[#D4AF37]">
                  Faça login
                            </a>
                        </p>
                    </CardFooter>
                ) }
            </Card>
        </div>
    );
}
