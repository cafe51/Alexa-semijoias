// app/checkout/AccountSection/LoginSection.tsx
import { useState } from 'react';
import LoginForm from '@/app/components/LoginForm';
import { Dispatch, SetStateAction } from 'react';

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
                onClick={ onClick }
            />
        </section>
    );
}