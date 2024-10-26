// app/checkout/AccountSection/LoginSection.tsx
import { useState } from 'react';
import LoginForm from '@/app/components/LoginForm2';
import { Dispatch, SetStateAction } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LoginSectionProps {
  setShowLogin: (isLogin: boolean) => void;
  setIsCartLoading: Dispatch<SetStateAction<boolean>>;

}

export default function LoginSection({ setShowLogin, setIsCartLoading }: LoginSectionProps) {
    const [loadingButton, setLoadingButton] = useState(true);

    const onClick = () => {
        setIsCartLoading(true);
    };

    return (
        <section className=" bg-[#FAF9F6] flex items-center justify-center px-4 py-0" >
            <Card className="w-full max-w-md bg-white shadow-lg">
                <CardHeader className="flex justify-between w-full">
                    <CardTitle className="text-2xl sm:text-3xl font-bold text-[#333333]">Login</CardTitle>
                    <p
                        className='text-blue-400 text-sm text-end'
                        onClick={ () => setShowLogin(false) }
                    >
                            Cadastre-se
                    </p>
                </CardHeader>
                <CardContent className="max-w-md mx-auto p-6 sm:p-8 md:p-10 lg:p-12 rounded-lg">
                    <LoginForm loadingButton={ loadingButton } setLoadingButton={ setLoadingButton } onClick={ onClick }/>
                </CardContent>
            </Card>
        </section>
    );
}