import { useState } from 'react';
import { auth } from '../firebase/config';
import { deleteUser, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useCollection } from './useCollection';
import { useUserInfo } from './useUserInfo';


export const useDeleteUser = () => {
    const router = useRouter();
    const { deleteDocument } = useCollection('usuarios', null);
    const userInfo = useUserInfo()?.userInfo;

    const [error, setError] = useState<null | string>(null);

    const signInUser = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const deleteUserAccountFunction = () => {

        if(!userInfo) throw new Error('usuário não encontrado');
        console.log('USUARIO USERINFO USEDELETEUSER', userInfo, userInfo.id);
        deleteDocument(userInfo.id)
            .then(() => {
                console.log('DELETOOOU', userInfo, userInfo.id);
            }).catch((err) => {
                if (err instanceof Error) {
                    setError(err.message);
                    return;
                }
            });
        const user = auth.currentUser;
        if (user) {
            
            deleteUser(user)
                .then(() => {
                    console.log('Usuário excluído com sucesso.');
                })
                .catch((err) => {
                    if (err instanceof Error) { setError(err.message); }
                });
        } else {
            console.log('Nenhum usuário está autenticado.');
        }
    };

    const deleteUserAccount = (email: string, password: string) => {
        signInUser(email, password)
            .then(() => {
                deleteUserAccountFunction();
            }).then(() => {
                // logout();
                router.push('/');
            })
            .catch((err) => {
                if (err instanceof Error) { setError(err.message); }
            });
    };


    return { error, deleteUserAccount  };
};