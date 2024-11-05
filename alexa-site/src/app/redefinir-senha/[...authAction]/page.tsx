// app/(seu-diretório-de-páginas)/redefinir-senha/[...authAction]/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import Link from 'next/link';
import { auth } from '../../firebase/config';

const ResetPasswordPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const oobCode = searchParams.get('oobCode');
    const mode = searchParams.get('mode');

    const [email, setEmail] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const verifyCode = async() => {
        if (!oobCode || mode !== 'resetPassword') {
            router.push('/');
            return;
        }

        try {
            const userEmail = await verifyPasswordResetCode(auth, oobCode);
            setEmail(userEmail);
        } catch (err) {
            setError('O link de redefinição é inválido ou expirou.');
        }
    };

    useEffect(() => {
        verifyCode();
    }, [oobCode, mode]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode as string, newPassword);
            setSuccess(true);
        } catch (err) {
            setError('Ocorreu um erro ao redefinir a senha.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md p-6 bg-white border border-gray-300 shadow-lg rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">Redefinir Senha</h2>

                { error && <p className="text-red-500 mb-4">{ error }</p> }

                { success ? (
                    <div className="flex flex-col items-center">
                        <p className="text-green-600 font-medium mb-4">
                            Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha.
                        </p>
                        <Link href="/login" className="mt-4 inline-block bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200">
                                Ir para Login
                        </Link>
                    </div>
                ) : (
                    !error && email && (
                        <>
                            <p className="mb-4 text-gray-700">
                                Redefina a senha para o e-mail: <strong>{ email }</strong>
                            </p>
                            <form onSubmit={ handleSubmit } className="flex flex-col space-y-4">
                                <div>
                                    <label htmlFor="newPassword" className="block font-medium mb-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        id="newPassword"
                                        value={ newPassword }
                                        onChange={ (e) => setNewPassword(e.target.value) }
                                        required
                                        className="p-2 border border-gray-400 rounded w-full"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={ confirmPassword }
                                        onChange={ (e) => setConfirmPassword(e.target.value) }
                                        required
                                        className="p-2 border border-gray-400 rounded w-full"
                                    />
                                </div>
                                <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200">
                                    Redefinir Senha
                                </button>
                            </form>
                        </>
                    )
                ) }
            </div>
        </div>
    );
};

const ResetPasswordPage = () => (
    <Suspense fallback={ <p>Carregando...</p> }>
        <ResetPasswordPageContent />
    </Suspense>
);

export default ResetPasswordPage;
