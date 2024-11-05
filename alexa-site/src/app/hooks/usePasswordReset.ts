// app/hooks/usePasswordReset.ts

import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { getFirebaseErrorMessage } from '../utils/getFirebaseErrorMessage';

export const usePasswordReset = () => {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    
    const resetPassword = async(email: string) => {
        setError(null);
        setSuccess(null);

        try {
            await sendPasswordResetEmail(auth, email);
            setSuccess('E-mail de recuperação enviado com sucesso. Verifique sua caixa de entrada para redefinir a senha.');
        } catch (err) {
            if (err instanceof Error) {
                setError(getFirebaseErrorMessage(err.message));
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
        }
    };

    return { resetPassword, error, success };
};
