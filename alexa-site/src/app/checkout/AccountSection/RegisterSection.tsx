// app/checkout/AccountSection/RegisterSection.tsx

'use client';
import GoogleAdditionalInfo from '@/app/components/register/GoogleAdditionalInfo';
import RegisterForm from '@/app/components/register/RegisterForm2';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dispatch, SetStateAction, useState } from 'react';

interface RegisterSectionProps {
    setShowLogin: (isLogin: boolean) => void;
    setIsCartLoading: Dispatch<SetStateAction<boolean>>;
}

export default function RegisterSection({ setShowLogin, setIsCartLoading }: RegisterSectionProps) {
    const [incompleteSignIn, setIncompleteSignIn] = useState(false);
    const [signedEmail, setSignedEmail] = useState<string | undefined>(undefined);
    const [uid, setUid] = useState<string | undefined>(undefined);

    return (
        <section className=" bg-[#FAF9F6] flex items-center justify-center px-0 py-0" >
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="flex justify-between w-full">
                    <CardTitle className="text-2xl md:text-3xl font-bold text-[#333333]">Crie sua conta</CardTitle>
                    <p
                        className='text-[#D4AF37] text-sm text-end cursor-pointer md:text-lg'
                        onClick={ () => setShowLogin(true) }
                    >
        Fazer login
                    </p>
                </CardHeader>
                <CardContent>
                    { incompleteSignIn && uid
                        ? 
                        <GoogleAdditionalInfo userId={ uid } />
                        :(
                            <RegisterForm
                                setSignedEmail={ (email) => setSignedEmail(email) }
                                setIncompleteSignIn={ () => setIncompleteSignIn(true) }
                                setUid={ (uid: string) => setUid(uid) }
                                setIsCartLoading={ () => setIsCartLoading(true) }
                            />
                        ) }
                    
                </CardContent>
                { !signedEmail && (
                    <CardFooter className="text-center">
                        <p className="text-sm text-[#333333]">
                Já tem uma conta?{ ' ' }
                            <span onClick={ () => setShowLogin(true) } className="font-medium text-[#C48B9F] hover:text-[#D4AF37]">
                  Faça login
                            </span>
                        </p>
                    </CardFooter>
                ) }
            </Card>
        </section>

    );
}