// app/hooks/useLogin.ts

import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
    const router = useRouter();

    const { dispatch } = useAuthContext();
    const [error, setError] = useState(null);

    const login = (email: string, password: string) => {
        setError(null);
        signInWithEmailAndPassword(auth, email, password)
            .then((res) => { 
                dispatch({ type: 'LOGIN', payload: res.user });
                router.push('/');
            })
            .catch((err) => setError(err.message));
    };

    return { error, login };
};