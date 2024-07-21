// app/checkout/AccountSection/LoginSection.tsx
import { useState } from 'react';
import LoginForm from '@/app/components/LoginForm';

interface LoginSectionProps {
  setShowLogin: (isLogin: boolean) => void;
}

export default function LoginSection({ setShowLogin }: LoginSectionProps) {
    const [loadingButton, setLoadingButton] = useState(true);

    return (
        <section className="flex flex-col border p-4 rounded-md shadow-md bg-white gap-4">
            <div className='flex justify-between w-full'>
                <p className="font-bold">LOGIN</p>
                <p
                    className='text-blue-400 text-sm w-full text-end'
                    onClick={ () => setShowLogin(false) }
                >
                    Cadastre-se
                </p>
            </div>

            <LoginForm
                setLoadingButton={ setLoadingButton }
                loadingButton={ loadingButton }
            />
        </section>
    );
}