// app/hooks/useSignUp.ts

import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useCollection } from './useCollection';
import { getFirebaseErrorMessage } from '../utils/getFirebaseErrorMessage';
import { UserType } from '../utils/types';

export const useSignUp = () => {
    const [error, setError] = useState<null | string>(null);
    const [message, setMessage] = useState<null | string>(null); // Adiciona o estado para mensagens de feedback ao usuário
    const { addDocument: createNewUser } = useCollection<UserType>('usuarios');

    const signup = async(singInData : { email: string, password: string, nome: string, phone: string }) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, singInData.email, singInData.password);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...sigInDataWithoutPassword } = singInData;

            await createNewUser({ ...sigInDataWithoutPassword, userId: res.user.uid, admin: false, cpf: '' }, res.user.uid);

            await sendEmailVerification(res.user);
            setMessage('Cadastro realizado com sucesso! Verifique sua caixa de entrada para confirmar seu e-mail e ativar sua conta.');

        } catch (err) {
            if (err instanceof Error) {
                setError(getFirebaseErrorMessage(err.message));
                console.log(err.message);
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
        }
    };

    return { error, message, signup };
};
