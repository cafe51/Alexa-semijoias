//src/app/components/ResetPassword.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase/config';


export default function ResetPassword({ oobCode }: { oobCode: string }) {
    const [email, setEmail] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    useEffect(() => {
        const verifyCode = async() => {
            try {
                const userEmail = await verifyPasswordResetCode(auth, oobCode);
                setEmail(userEmail);
            } catch {
                setError('O link de redefinição é inválido ou expirou.');
            }
        };
        verifyCode();
    }, [oobCode]);

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setSuccess(true);
        } catch {
            setError('Ocorreu um erro ao redefinir a senha.');
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Redefinir Senha</h2>
            { error && <p className="text-red-500 mb-4">{ error }</p> }
            { success ? (
                <>
                    <p className="text-green-600 mb-4">Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha.</p>
                    <Link href="/login" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
                        Ir para Login
                    </Link>
                </>
            ) : (
                !error && email && (
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
                )
            ) }
        </div>
    );
}
