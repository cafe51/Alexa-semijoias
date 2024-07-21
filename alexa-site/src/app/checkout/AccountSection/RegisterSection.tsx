// app/checkout/AccountSection/RegisterSection.tsx
import { useState } from 'react';
import RegisterForm from '@/app/components/RegisterForm';

interface RegisterSectionProps {
    setShowLogin: (isLogin: boolean) => void;
}

export default function RegisterSection({ setShowLogin }: RegisterSectionProps) {
    const [loadingButton, setLoadingButton] = useState(true);

    return (
        <section className="flex flex-col border p-4 rounded-md shadow-md bg-white gap-4">
            <div className='flex justify-between w-full'>
                <p className="font-bold">Cadastro</p>
                <p
                    className='text-blue-400 text-sm w-full text-end'
                    onClick={ () => setShowLogin(true) }
                >
                Fazer login
                </p>
            </div>

            <RegisterForm loadingButton={ loadingButton } setLoadingButton={ setLoadingButton } />
        </section>
    );
}