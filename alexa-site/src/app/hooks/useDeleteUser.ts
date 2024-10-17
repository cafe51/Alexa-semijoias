import { useState } from 'react';
import { auth } from '../firebase/config';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { useCollection } from './useCollection';
import { useUserInfo } from './useUserInfo';

export const useDeleteUser = () => {
    const { deleteDocument: deleteUserFromDb } = useCollection('usuarios'); // Importa getAllDocuments
    const { deleteDocument: deleteCartItemFromDb, getAllDocuments } = useCollection('carrinhos'); // Importa deleteDocument para carrinhos
    const userInfo = useUserInfo()?.userInfo;

    const [error, setError] = useState<null | string>('ERADO');

    const signInUser = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const deleteUserAccount = async(email: string, password: string) => {
        try {
            await signInUser(email, password);
            
            if (!userInfo) throw new Error('Usuário não encontrado');

            const user = auth.currentUser;

            if (!user) throw new Error('Nenhum usuário está autenticado.');

            // 1. Busca os itens do carrinho do usuário
            const carrinhoItems = await getAllDocuments([{ field: 'userId', operator: '==', value: userInfo.userId }]);

            // 2. Deleta cada item do carrinho
            await Promise.all(carrinhoItems.map(item => deleteCartItemFromDb(item.id)));

            // 3. Deleta o usuário da coleção "usuarios"
            await deleteUserFromDb(userInfo.id);

            // 4. Deleta o usuário do Firebase Authentication
            await deleteUser(user);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
                throw err; // Lança o erro para que o componente possa lidar com ele
            }
        }
    };

    return { error, deleteUserAccount };
};
