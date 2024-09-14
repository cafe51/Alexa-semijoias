// app/hooks/useLogin.ts
import { signInWithEmailAndPassword, getIdTokenResult } from 'firebase/auth';
import { useState } from 'react';
import { auth, projectFirestoreDataBase } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { useLocalStorage } from './useLocalStorage';
import { CartInfoType } from '../utils/types';
import { useCollection } from './useCollection';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getDoc, doc } from 'firebase/firestore';

export const useLogin = () => {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const { getLocalCart, setLocalCart } = useLocalStorage();
    const { addDocument: createNewCart, deleteDocument: deleteCartItemFromDb, getAllDocuments } = useCollection<CartInfoType>('carrinhos'); 

    const syncLocalCartToFirebase = async(userId: string) => {
        try {
            const carrinhoItems = await getAllDocuments([{ field: 'userId', operator: '==', value: userId }]);
            const localCart: CartInfoType[] = getLocalCart();
            
            if(localCart && localCart.length > 0) {    
                await Promise.all(carrinhoItems.map(item => deleteCartItemFromDb(item.id)));
                await Promise.all(localCart.map((item) => {
                    item.userId = userId;
                    return createNewCart(item);
                }));
                setLocalCart([]); 
            }
        
        } catch (error) {
            console.error('Erro ao sincronizar carrinho:', error);
            setError('Ocorreu um erro ao sincronizar o carrinho. Por favor, tente novamente.'); 
        }
    };

    const checkAndSetAdminClaim = async(user: any) => {
        try {
            const userDoc = await getDoc(doc(projectFirestoreDataBase, 'usuarios', user.uid));
            const userData = userDoc.data();
            const isAdminInFirestore = userData?.admin === true;

            const idTokenResult = await getIdTokenResult(user, true);
            const hasAdminClaim = idTokenResult.claims.admin === true;

            if (isAdminInFirestore && !hasAdminClaim) {
                const functions = getFunctions();
                const setAdminClaim = httpsCallable(functions, 'setAdminClaim');
                await setAdminClaim({ uid: user.uid });
                // Atualizar o token após definir o claim
                await user.getIdToken(true);
            }

            dispatch({ type: 'SET_ADMIN', payload: isAdminInFirestore });
            console.log('useLogin - isAdmin:', isAdminInFirestore);
        } catch (error) {
            console.error('Erro ao verificar status de administrador:', error);
            dispatch({ type: 'SET_ADMIN', payload: false });
        }
    };

    const login = async(email: string, password: string) => {
        setError(null); 

        try {
            const res = await signInWithEmailAndPassword(auth, email, password); 
            dispatch({ type: 'LOGIN', payload: res.user });

            await syncLocalCartToFirebase(res.user.uid); 
            await checkAndSetAdminClaim(res.user);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);  
            } else { 
                setError('Ocorreu um erro desconhecido durante o login.'); 
            }
        }
    };

    return { error, login };
};