import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { auth, projectFirestoreDataBase } from '../firebase/config';
import { useAuthContext } from './useAuthContext';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { useCollection } from './useCollection';
import { UserType } from '../utils/types';
import { useSyncCart } from './useSyncCart';

export const useGoogleAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const { addDocument: createNewUser } = useCollection<UserType>('usuarios');
    const { syncLocalCartToFirebase } = useSyncCart();

    const signInWithGoogle = async(): Promise<{ 
        success: boolean; 
        needsAdditionalInfo?: boolean;
        uid?: string;
    }> => {
        setError(null);
        setIsLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Verifica se o usuário já existe no Firestore
            const userDoc = await getDoc(doc(projectFirestoreDataBase, 'usuarios', user.uid));

            if (!userDoc.exists()) {
                // Cria um novo usuário com dados básicos do Google
                await createNewUser({
                    userId: user.uid,
                    email: user.email || '',
                    nome: user.displayName || '',
                    phone: '',
                    admin: false,
                    cpf: '',
                    createdAt: Timestamp.now(),
                }, user.uid);
                
                return {
                    success: true,
                    needsAdditionalInfo: true,
                    uid: user.uid,
                };
            }

            // Verifica se o usuário existente tem o CPF cadastrado
            const userData = userDoc.data();
            if (!userData || !userData.cpf) {
                return {
                    success: true,
                    needsAdditionalInfo: true,
                    uid: user.uid,
                };
            }

            // Usuário já existe e tem dados complementares
            try {
                await syncLocalCartToFirebase(user.uid);
                dispatch({ type: 'LOGIN', payload: user });
                return { success: true };
            } catch (syncError) {
                setError('Ocorreu um erro ao sincronizar o carrinho. Por favor, tente novamente.');
                return { success: false };
            }

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                console.error('Erro na autenticação com Google:', err.message);
            } else {
                setError('Ocorreu um erro desconhecido durante a autenticação com Google.');
            }
            return { success: false };
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, signInWithGoogle };
};
