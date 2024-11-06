// app/hooks/useSignUp.ts

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useCollection } from './useCollection';
import { getFirebaseErrorMessage } from '../utils/getFirebaseErrorMessage';
import { UserType } from '../utils/types';

export interface SignUpResult {
    success: boolean;
    verificationEmailSent?: boolean;
    email?: string;
}

export const useSignUp = () => {
    const [error, setError] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addDocument: createNewUser } = useCollection<UserType>('usuarios');

    const signup = async(signInData: { 
        email: string, 
        password: string, 
        nome: string, 
        phone: string 
    }): Promise<SignUpResult> => {
        setError(null);
        setIsLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, signInData.email, signInData.password);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...signInDataWithoutPassword } = signInData;

            await createNewUser(
                { ...signInDataWithoutPassword, userId: res.user.uid, admin: false, cpf: '' }, 
                res.user.uid,
            );

            
            await sendEmailVerification(res.user);
            
            return {
                success: true,
                verificationEmailSent: true,
                email: signInData.email,
            };

        } catch (err) {
            if (err instanceof Error) {
                setError(getFirebaseErrorMessage(err.message));
                console.log(err.message);
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, signup };
};
