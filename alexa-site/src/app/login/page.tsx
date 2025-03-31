'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../hooks/useAuthContext';
import { useUserInfo } from '../hooks/useUserInfo';
import LoginForm from '../components/LoginForm2';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingIndicator from '../components/LoadingIndicator';
import GoogleAdditionalInfo from '../components/register/GoogleAdditionalInfo';

export default function Login() {
    const [incompleteSignIn, setIncompleteSignIn] = useState(false);
    const [uid, setUid] = useState<string | undefined>(undefined);
    const router = useRouter();
    const { user } = useAuthContext();
    const { userInfo } = useUserInfo();

    useEffect(() => {
        try {
            if(userInfo) {
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

    if (userInfo === null || userInfo) {
        return <LoadingIndicator />; 
    }

    return (
        <div className="bg-[#FAF9F6] flex items-center justify-center py-16 px-4">
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#333333]">
                        {
                            'Bem-vindo(a) de volta'
                        }
                    </CardTitle>
                </CardHeader>
                <CardContent className="max-w-md mx-auto p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg">
                    {
                        incompleteSignIn && uid
                            ? 
                            <GoogleAdditionalInfo userId={ uid } />
                            :
                            (
                                <LoginForm 
                                    setIncompleteSignIn={ () => setIncompleteSignIn(true) }
                                    setUid={ (uid: string) => setUid(uid) }
                                />
                            )
                    }
                </CardContent>

                <CardFooter className="text-center py-4">
                    <p className="text-base sm:text-lg md:text-xl font-medium text-[#333333]">
                                Não tem uma conta?{ ' ' }
                        <a href="/cadastro" className="font-medium text-base sm:text-lg md:text-xl text-[#C48B9F] hover:text-[#D4AF37]">
                                    Registre-se
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}