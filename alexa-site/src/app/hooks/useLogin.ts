// app/hooks/useLogin.ts
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { useLocalStorage } from './useLocalStorage';
import { CartInfoType } from '../utils/types';
import { useCollection } from './useCollection';

export const useLogin = () => {
    const { dispatch } = useAuthContext();
    const [error, setError] = useState<string | null>(null);
    const { getLocalCart, setLocalCart } = useLocalStorage();
    const { addDocument: createNewCart, deleteDocument: deleteCartItemFromDb, getAllDocuments } = useCollection('carrinhos'); 

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

    const login = async(email: string, password: string) => {
        setError(null); 

        try {
            const res = await signInWithEmailAndPassword(auth, email, password); 
            dispatch({ type: 'LOGIN', payload: res.user });

            await syncLocalCartToFirebase(res.user.uid); 

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