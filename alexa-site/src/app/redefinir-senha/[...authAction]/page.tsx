// app/(seu-diretório-de-páginas)/redefinir-senha/[...authAction]/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../../firebase/config';

const ResetPasswordPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extrai o código e o modo da URL
    const oobCode = searchParams.get('oobCode');
    const mode = searchParams.get('mode');
    
    const [email, setEmail] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Verifica o código de redefinição ao carregar a página
    const verifyCode = async() => {
        // Redireciona para a página inicial se não houver um código ou o modo não for de redefinição de senha
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
            setSuccess('Senha redefinida com sucesso! Você pode fazer login agora.');
            setTimeout(() => router.push('/login'), 3000);
        } catch (err) {
            setError('Ocorreu um erro ao redefinir a senha.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-md p-6 bg-white border border-gray-300 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Redefinir Senha</h2>

                { /* Renderiza erro se o link expirou ou é inválido */ }
                { error && <p className="text-red-500 mb-4">{ error }</p> }

                { /* Renderiza sucesso se a senha foi redefinida */ }
                { success && <p className="text-green-500 mb-4">{ success }</p> }

                { /* Renderiza o formulário se o link é válido e não há sucesso */ }
                { !error && !success && email && (
                    <>
                        <p className="mb-4 text-gray-700">Redefina a senha para o e-mail: <strong>{ email }</strong></p>
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
                            <button type="submit" className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Redefinir Senha
                            </button>
                        </form>
                    </>
                ) }

                { /* Renderiza mensagem de erro se o link for inválido */ }
                { !oobCode && (
                    <p className="text-gray-700">
                        O código de redefinição é inválido ou expirou. Por favor, solicite uma nova redefinição de senha.
                    </p>
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
