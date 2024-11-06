// app/checkout/AccountSection/LoginSection.tsx
import { useState } from 'react';
import LoginForm from '@/app/components/LoginForm2';
import { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmailVerification from '@/app/components/EmailVerification';

interface LoginSectionProps {
    setShowLogin: (isLogin: boolean) => void;
    setIsCartLoading: Dispatch<SetStateAction<boolean>>;
}

export default function LoginSection({ setShowLogin, setIsCartLoading }: LoginSectionProps) {
    const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
    const onClick = () => {
        setIsCartLoading(true);
    };

    const handleBackToLogin = () => {
        setUnverifiedEmail(null);
    };

    return (
        <section className=" bg-[#FAF9F6] flex items-center justify-center px-0 py-0" >
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="flex justify-between w-full">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#333333]">
                        { unverifiedEmail ? 'Verificação Necessária' : 'Entre com sua conta' }
                    </CardTitle>
                    <p
                        className='text-[#D4AF37] text-sm text-end cursor-pointer md:text-lg'
                        onClick={ () => setShowLogin(false) }
                    >
                            Cadastre-se
                    </p>
                </CardHeader>
                <CardContent className="max-w-md mx-auto p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg">
                    { unverifiedEmail ? (
                        <EmailVerification
                            email={ unverifiedEmail }
                            onBackToLogin={ handleBackToLogin }
                        />
                    ) : (
                        <LoginForm 
                            onUnverifiedEmail={ setUnverifiedEmail }
                            onClick={ onClick }
                        />
                    ) }
                </CardContent>
            </Card>
        </section>
    );
}