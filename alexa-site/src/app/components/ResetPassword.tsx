// src/app/components/ResetPassword.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
        <div className="max-w-lg mx-auto p-6 bg-[#FAF9F6] shadow-lg rounded-lg border border-[#F8C3D3]">
            <h2 className="text-2xl font-semibold text-center mb-4 text-[#333333]">Redefinir Senha</h2>
            { error && (
                <Alert variant="destructive" className="mb-4 border-l-4 border-[#C48B9F] bg-[#F8C3D3] text-[#333333]">
                    <AlertTitle>Erro</AlertTitle>
                    <AlertDescription>{ error }</AlertDescription>
                </Alert>
            ) }
            { success ? (
                <div className="text-center">
                    <p className="text-[#333333] mb-4">
                        Senha redefinida com sucesso! Agora você pode fazer login com sua nova senha.
                    </p>
                    <Button asChild className="bg-[#D4AF37] text-white hover:bg-opacity-90">
                        <Link href="/login">Ir para Login</Link>
                    </Button>
                </div>
            ) : (
                !error &&
                email && (
                    <form onSubmit={ handleSubmit } className="space-y-6">
                        <div>
                            <label
                                htmlFor="newPassword"
                                className="block font-medium text-[#333333] mb-2"
                            >
                                Nova Senha
                            </label>
                            <Input
                                type="password"
                                id="newPassword"
                                value={ newPassword }
                                onChange={ (e) => setNewPassword(e.target.value) }
                                required
                                placeholder="Digite sua nova senha"
                                className="bg-[#FAF9F6] border-[#F8C3D3] text-[#333333] focus:ring-[#D4AF37]"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block font-medium text-[#333333] mb-2"
                            >
                                Confirmar Nova Senha
                            </label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                value={ confirmPassword }
                                onChange={ (e) => setConfirmPassword(e.target.value) }
                                required
                                placeholder="Confirme sua nova senha"
                                className="bg-[#FAF9F6] border-[#F8C3D3] text-[#333333] focus:ring-[#D4AF37]"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-[#D4AF37] text-white py-2 px-4 rounded hover:bg-opacity-90"
                        >
                            Redefinir Senha
                        </Button>
                    </form>
                )
            ) }
        </div>
    );
}
