// app/hooks/useSignUp.ts

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useCollection } from './useCollection';
import { useLogin } from './useLogin';
import { CartInfoType, UserType } from '../utils/types';
import { useLocalStorage } from './useLocalStorage';

export const useSignUp = () => {
    const [error, setError] = useState<null | string>(null);
    const { addDocument: createNewUser } = useCollection<UserType>('usuarios');
    const { addDocument: createNewCart } = useCollection<CartInfoType>('carrinhos');
    const { getLocalCart, setLocalCart } = useLocalStorage();


    const { login } = useLogin();

    const syncLocalCartToFirebase = async(userId: string) => {
        const localCart: CartInfoType[] = getLocalCart();
        await Promise.all(localCart.map((item) => {
            item.userId = userId;
            return createNewCart(item);
        }));
    
        setLocalCart([]);
    };

    const signup = async(singInData : { email: string, password: string, nome: string, tel: string }) => {
        try {
            const res = await createUserWithEmailAndPassword(auth, singInData.email, singInData.password);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { password, ...sigInDataWithoutPassword } = singInData;

            await createNewUser({ ...sigInDataWithoutPassword, userId: res.user.uid, admin: false, cpf: '' }, res.user.uid);

            await syncLocalCartToFirebase(res.user.uid);

            await login(singInData.email, singInData.password);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
        }
    };

    return { error, signup };
};
