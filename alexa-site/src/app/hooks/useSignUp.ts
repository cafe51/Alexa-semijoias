import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useCollection } from './useCollection';
import { useLogin } from './useLogin';


export const useSignUp = () => {
    const [error, setError] = useState<null | string>(null);
    const { addDocument } = useCollection('usuarios', null);
    const { login } = useLogin();


    const signup = (singInData : { email: string, password: string, nome: string, tel: string }) => {
    // setError(null);
    // createUserWithEmailAndPassword(auth, email, password)
    // .then((res) => console.log('user singup', res.user)) 
    // .catch((err) => setError(err.message));

        try {

            createUserWithEmailAndPassword(auth, singInData.email, singInData.password)
                .then((res) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { password, ...sigInDataWithoutPassword } = singInData;
                    addDocument({ ...sigInDataWithoutPassword, userId: res.user.uid, admin: false, cpf: '' });
                    console.log('user singup', res.user);
                    login(singInData.email, singInData.password);

                }).catch((err) => {
                    if (err instanceof Error) { setError(err.message); }
                });


        } catch(err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocorreu um erro desconhecido.');
            }
        }

    };

    return { error, signup };
};