// app/carrinho/CartItem.ts
import Image from 'next/image';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import formatPrice from '../utils/formatPrice';
import { useEffect } from 'react';
import blankImage from '../../../public/blankImage.jpg';
import SelectingQuantityBox from '../components/SelectingQuantityBox';
// import { FaRegTrashAlt } from 'react-icons/fa';
import { PiTrashSimpleBold } from 'react-icons/pi';
import DisplayCustomProperties from '../components/DisplayCustomProperties';

export default function CartItem({ produto }: { produto: ProductCartType | (ProductCartType & FireBaseDocument) }) {
    const { user } = useAuthContext();
    const { addOneToLocalStorage, removeOneFromLocalStorage, removeItemFromLocalStorageCart } = useLocalStorage();

    useEffect(() => {
        console.log('PRODUTOOOOO', produto);
    }, [produto]);

    const { updateDocumentField, deleteDocument } = useCollection(
        'carrinhos',
    );

    let cartId: string;

    if(user) {
        const { id } = produto as (ProductCartType & FireBaseDocument);
        cartId = id;
    }

    const addOne = () => {
        return user ? updateDocumentField(cartId, 'quantidade', produto.quantidade +=1) : addOneToLocalStorage(produto);
    };

    const removeOne = () => {
        return user ? updateDocumentField(cartId, 'quantidade', produto.quantidade -=1) : removeOneFromLocalStorage(produto);
    };

    const removeAll = () => {
        return user ? deleteDocument(cartId) : removeItemFromLocalStorageCart(produto.skuId);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-52 justify-between p-4 bg-white shadow-lg rounded-lg shadowColor' >
            <div className='flex gap-4 w-full h-[90px] '>
                <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ produto.image ? produto.image : blankImage }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='flex flex-col justify-between h-full text-xs flex-grow'>
                    <div className='flex-grow'>
                        <p>{ produto.name }</p>
                    </div>
                    { produto.customProperties && <DisplayCustomProperties customProperties={ produto.customProperties }/> }
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
                    quantity={ produto.quantidade }
                    removeOne={ removeOne }
                    addOne={ addOne }
                    stock={ produto.estoque }
                />
                <div className="ml-4">
                    <span className="font-semibold">{ formatPrice((produto.value.promotionalPrice ? produto.value.promotionalPrice : produto.value.price) * produto.quantidade) }</span>
                </div>
            </div>
        </div>
    );
}