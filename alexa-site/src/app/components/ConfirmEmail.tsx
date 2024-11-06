// src/app/components/ConfirmEmail.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function ConfirmEmail({ oobCode }: { oobCode: string }) {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const confirmEmail = async() => {
            try {
                await applyActionCode(auth, oobCode);
            } catch {
                setError('O link de confirmação é inválido ou expirou.');
            }
        };
        confirmEmail();
    }, [oobCode]);

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Confirmação de E-mail</h2>
            { error && <p className="text-red-500 mb-4">{ error }</p> }
            <>
                <p className="text-green-600 mb-4">E-mail confirmado com sucesso! Você já pode fazer login.</p>
                <Link href="/login" className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
                        Ir para Login
                </Link>
            </>
        </div>
    );
}
