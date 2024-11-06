// app/checkout/AccountSection/RegisterSection.tsx
'use client';
import EmailVerification from '@/app/components/EmailVerification';
import RegisterForm from '@/app/components/register/RegisterForm2';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

interface RegisterSectionProps {
    setShowLogin: (isLogin: boolean) => void;
}

export default function RegisterSection({ setShowLogin }: RegisterSectionProps) {
    const [signedEmail, setSignedEmail] = useState<string | undefined>(undefined);

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
                    { signedEmail ? (
                        <EmailVerification
                            email={ signedEmail }
                            onBackToLogin={ () => setShowLogin(true) }
                        />
                    ) : (
                        <RegisterForm setSignedEmail={ (email) => setSignedEmail(email) }/>
                    ) }
                    
                </CardContent>
            </Card>
        </section>

    );
}