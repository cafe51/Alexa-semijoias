import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

// import { useContext } from "react"
// import { AuthContext } from "../context/AuthContext"

export const useLogin = () => {
    // const context = useContext(AuthContext)

    const { dispatch } = useAuthContext();
    const [error, setError] = useState(null);

    const login = (email: string, password: string) => {
        setError(null);
        signInWithEmailAndPassword(auth, email, password)
            .then((res) => { 
                dispatch({ type: 'LOGIN', payload: res.user });
            })
            .catch((err) => setError(err.message));

    };

    return { error, login };
};