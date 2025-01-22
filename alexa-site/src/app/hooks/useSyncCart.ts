import { useLocalStorage } from './useLocalStorage';
import { CartInfoType } from '../utils/types';
import { useCollection } from './useCollection';

export const useSyncCart = () => {
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
            throw new Error('Ocorreu um erro ao sincronizar o carrinho. Por favor, tente novamente.');
        }
    };

    return { syncLocalCartToFirebase };
};
