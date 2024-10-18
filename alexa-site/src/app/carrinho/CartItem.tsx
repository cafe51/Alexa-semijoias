// app/carrinho/CartItem.ts
import Image from 'next/image';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatPrice } from '../utils/formatPrice';
import { useEffect } from 'react';
import blankImage from '../../../public/blankImage.jpg';
import SelectingQuantityBox from '../components/SelectingQuantityBox';
// import { FaRegTrashAlt } from 'react-icons/fa';
import { PiTrashSimpleBold } from 'react-icons/pi';
import DisplayCustomProperties from '../components/DisplayCustomProperties';

export default function CartItem({ cartItem }: { cartItem: ProductCartType | (ProductCartType & FireBaseDocument) }) {
    const { user } = useAuthContext();
    const { addOneToLocalStorage, removeOneFromLocalStorage, removeItemFromLocalStorageCart } = useLocalStorage();

    useEffect(() => {
        console.log('PRODUTOOOOO', cartItem);
    }, [cartItem]);

    const { updateDocumentField, deleteDocument } = useCollection(
        'carrinhos',
    );

    let cartId: string;

    if(user) {
        const { id } = cartItem as (ProductCartType & FireBaseDocument);
        cartId = id;
    }

    const addOne = () => {
        return user ? updateDocumentField(cartId, 'quantidade', cartItem.quantidade +=1) : addOneToLocalStorage(cartItem);
    };

    const removeOne = () => {
        return user ? updateDocumentField(cartId, 'quantidade', cartItem.quantidade -=1) : removeOneFromLocalStorage(cartItem);
    };

    const removeAll = () => {
        return user ? deleteDocument(cartId) : removeItemFromLocalStorageCart(cartItem.skuId);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-52 justify-between p-4 bg-white shadow-lg rounded-lg shadowColor' >
            <div className='flex gap-4 w-full h-[90px] '>
                <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ cartItem.image ? cartItem.image : blankImage }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='flex flex-col justify-between h-full text-xs flex-grow'>
                    <div className='flex-grow'>
                        <p>{ cartItem.name }</p>
                    </div>
                    { cartItem.customProperties && <DisplayCustomProperties customProperties={ cartItem.customProperties }/> }
                </div>

                <div className='flex-shrink-0'>
                    <PiTrashSimpleBold
                        onClick={ removeAll }
                        data-testid={ 'trashButton' }
                    />
                </div>
            </div>
            <div className="flex justify-between items-center w-full">
                <SelectingQuantityBox
                    quantity={ cartItem.quantidade }
                    removeOne={ removeOne }
                    addOne={ addOne }
                    stock={ cartItem.estoque }
                />
                <div className="ml-4">
                    <span className="font-semibold">{ formatPrice((cartItem.value.promotionalPrice ? cartItem.value.promotionalPrice : cartItem.value.price) * cartItem.quantidade) }</span>
                </div>
            </div>
        </div>
    );
}