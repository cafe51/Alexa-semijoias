// app/hooks/useUpdateCard.ts
import { User } from 'firebase/auth';
import { CartInfoType, ProductType } from '../utils/types';
import { DocumentData } from 'firebase/firestore';
import { useLocalStorage } from './useLocalStorage';
import { useCollection } from './useCollection';
import { useAuthContext } from './useAuthContext';
import { Dispatch, SetStateAction } from 'react';

export const useAddNewItemCart = (carrinho: (CartInfoType & DocumentData)[] | null, productData: ProductType | null, setIsloadingButton: Dispatch<SetStateAction<boolean>>) => {
    const { addItemToLocalStorageCart } = useLocalStorage();
    const { addDocument, updateDocumentField } = useCollection('carrinhos');
    const { user } = useAuthContext();

    const addItemToFirebaseCart = (user: User, carrinho: (CartInfoType & DocumentData)[] | null, product: ProductType) => {
        const cartItem = carrinho?.find((item) => item.productId === product.id);
        if (!cartItem) {
            addDocument({
                productId: product.id,
                quantidade: 1,
                userId: user.uid,
            });
        } else if (cartItem.quantidade < product.estoque) {
            updateDocumentField(cartItem.id, 'quantidade', cartItem.quantidade += 1);
        }
    };

    const handleAddToCart = () => {
        try{
            setIsloadingButton(true);
            if(!productData) throw new Error('dados do produto não encontrados');
            if (!user) {
                // Usuário não está logado, salva no localStorage
                addItemToLocalStorageCart(productData);
                console.warn('user está deslogado!');
            } else {
                // Usuário está logado, salva no firebase
                addItemToFirebaseCart(user, carrinho, productData);
            }
        } catch(error){
            console.log('erro ao tentar adicionar ao carrinho', error);
        }
        finally {
            setTimeout(() => {
                setIsloadingButton(false);
            }, 1000);
        }
    
    };

    return { handleAddToCart };
};