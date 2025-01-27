// app/hooks/useSignUp.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useCollection } from './useCollection';
import { getFirebaseErrorMessage } from '../utils/getFirebaseErrorMessage';
import { UserType } from '../utils/types';
import { Timestamp } from 'firebase/firestore';
import { useSyncCart } from './useSyncCart';

export interface SignUpResult {
    success: boolean;
    email?: string;
    uid?: string;
}

export const useSignUp = () => {
    const [error, setError] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { addDocument: createNewUser } = useCollection<UserType>('usuarios');
    const { syncLocalCartToFirebase } = useSyncCart();

    const signup = async(signInData: { 
        email: string, 
        password: string, 
        nome: string, 
        phone: string,
        cpf: string,
    }): Promise<SignUpResult> => {
        setError(null);
        setIsLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, signInData.email, signInData.password);

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...signInDataWithoutPassword } = signInData;

            await createNewUser(
                { ...signInDataWithoutPassword, userId: res.user.uid, admin: false, createdAt: Timestamp.now() }, 
                res.user.uid,
            );

            try {
                await syncLocalCartToFirebase(res.user.uid);
                return {
                    success: true,
                    email: signInData.email,
                    uid: res.user.uid,
                };
            } catch (syncError) {
                console.error('Erro ao sincronizar carrinho:', syncError);
                setError('Erro ao sincronizar o carrinho. Por favor, tente novamente.');
                return {
                    success: false,
                    email: signInData.email,
                    uid: res.user.uid,
                };
            }

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
