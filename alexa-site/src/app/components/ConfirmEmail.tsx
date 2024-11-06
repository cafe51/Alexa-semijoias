// src/app/components/ConfirmEmail.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { applyActionCode, checkActionCode, sendEmailVerification, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function ConfirmEmail({ oobCode }: { oobCode: string }) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        const confirmEmail = async() => {
            try {
                const info = await checkActionCode(auth, oobCode);
                const emailFromCode = info?.data?.email ?? null;  // Garante que email será string | null
                setEmail(emailFromCode);
                
                await applyActionCode(auth, oobCode);
                setSuccess(true);
            } catch {
                setError('O link de confirmação é inválido ou expirou.');
            }
        };
        confirmEmail();
    }, [oobCode]);

    const handleResendVerification = async() => {
        if (!email) {
            setError('Não foi possível identificar o e-mail. Tente novamente.');
            return;
        }

        try {
            await signInWithEmailLink(auth, email, window.location.href);
            const user = auth.currentUser;

            if (user) {
                await sendEmailVerification(user, {
                    url: 'https://seusite.com/login', // Substitua pela URL de redirecionamento
                    handleCodeInApp: true,
                });
                setError(null);
                alert('Um novo e-mail de confirmação foi enviado. Verifique sua caixa de entrada.');
            } else {
                setError('Erro ao identificar o usuário. Tente novamente.');
            }
        } catch (err) {
            setError('Ocorreu um erro ao tentar reenviar a confirmação. Por favor, tente novamente.');
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Confirmação de E-mail</h2>
            { error && <p className="text-red-500 mb-4">{ error }</p> }
            { success ? (
                <>
                    <p className="text-green-600 mb-4">E-mail confirmado com sucesso! Você já pode fazer login.</p>
                    <Link href="/login" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
                        Ir para Login
                    </Link>
                </>
            ) : (
                error && (
                    <div>
                        <p className="text-gray-700 mb-4">Por favor, solicite uma nova confirmação de e-mail.</p>
                        <button
                            className="inline-block bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition duration-200"
                            onClick={ handleResendVerification }
                        >
                            Reenviar Confirmação
                        </button>
                    </div>
                )
            ) }
        </div>
    );
}
