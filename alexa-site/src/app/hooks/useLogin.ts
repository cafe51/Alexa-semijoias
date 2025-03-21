// app/hooks/useLogin.ts
import { signInWithEmailAndPassword, getIdTokenResult } from 'firebase/auth';
import { useState } from 'react';
import { auth, projectFirestoreDataBase } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDoc, doc } from 'firebase/firestore';
import { getFirebaseErrorMessage } from '../utils/getFirebaseErrorMessage';
import { useSyncCart } from './useSyncCart';

interface SignInResult {
    success: boolean;
    uid: string;
    SignInIncomplete: boolean;
}

export const useLogin = () => {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const { syncLocalCartToFirebase } = useSyncCart();

    const checkAndSetAdminClaim = async(user: any) => {
        try {
            const userDoc = await getDoc(doc(projectFirestoreDataBase, 'usuarios', user.uid));
            const userData = userDoc.data();
            const isAdminInFirestore = userData?.admin === true;
    
            console.log('useLogin - userData:', userData);
            console.log('useLogin - isAdminInFirestore:', isAdminInFirestore);
    
            const idTokenResult = await getIdTokenResult(user, true);
            const hasAdminClaim = idTokenResult.claims.admin === true;
    
            console.log('useLogin - hasAdminClaim:', hasAdminClaim);
    
            if (isAdminInFirestore && !hasAdminClaim) {
                console.log('useLogin - Tentando definir claim de admin');
                const functions = getFunctions();
                const setAdminClaim = httpsCallable(functions, 'setAdminClaim');
                try {
                    const result = await setAdminClaim({ uid: user.uid });
                    console.log('useLogin - Resultado da chamada setAdminClaim:', result);
                    // Atualizar o token após definir o claim
                    await user.getIdToken(true);
                    // Verificar novamente o token após atualização
                    const newIdTokenResult = await getIdTokenResult(user, true);
                    console.log('useLogin - Novo hasAdminClaim:', newIdTokenResult.claims.admin);
                } catch (callableError) {
                    console.error('Erro ao chamar setAdminClaim:', callableError);
                }
            }
    
            dispatch({ type: 'SET_ADMIN', payload: isAdminInFirestore });
            console.log('useLogin - isAdmin:', isAdminInFirestore);
        } catch (error) {
            console.error('Erro ao verificar status de administrador:', error);
            dispatch({ type: 'SET_ADMIN', payload: false });
        }
    };

    const login = async(email: string, password: string): Promise<SignInResult | undefined> => {
        setError(null);

        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            
            // Verifica se o usuário tem os dados complementares
            const userDoc = await getDoc(doc(projectFirestoreDataBase, 'usuarios', res.user.uid));
            const userData = userDoc.data();

            // Se o usuário tem CPF cadastrado, procede com o login completo
            if (userData && userData.cpf) {
                dispatch({ type: 'LOGIN', payload: res.user });
                try {
                    await syncLocalCartToFirebase(res.user.uid);
                } catch (syncError) {
                    setError('Ocorreu um erro ao sincronizar o carrinho. Por favor, tente novamente.');
                }
                await checkAndSetAdminClaim(res.user);
            }

            return { success: true, uid: res.user.uid, SignInIncomplete: !(userData && userData.cpf) };


        } catch (err) {
            if (err instanceof Error) {
                setError(getFirebaseErrorMessage(err.message));  
            } else { 
                setError('Ocorreu um erro desconhecido durante o login.'); 
            }
        }
    };

    return { error, login };
};
