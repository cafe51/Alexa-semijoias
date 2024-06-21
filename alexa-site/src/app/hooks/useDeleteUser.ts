// app/hooks/useDeleteUser.ts

import { useState } from 'react';
import { auth } from '../firebase/config';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { useCollection } from './useCollection';
import { useUserInfo } from './useUserInfo';

export const useDeleteUser = () => {
    const { deleteDocument } = useCollection('usuarios');
    const userInfo = useUserInfo()?.userInfo;

    const [error, setError] = useState<null | string>('ERADO');

    const signInUser = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const deleteUserAccount = async(email: string, password: string) => {
        try {
            await signInUser(email, password);

            if (!userInfo) throw new Error('Usuário não encontrado');
            
            await deleteDocument(userInfo.id);

            const user = auth.currentUser;
            if (user) {
                await deleteUser(user);
                console.log('Usuário excluído com sucesso.');
                setError(null);
            } else {
                throw new Error('Nenhum usuário está autenticado.');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
        }
    };

    return { error, deleteUserAccount };
};
