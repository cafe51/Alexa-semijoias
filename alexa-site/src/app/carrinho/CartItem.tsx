// app/carrinho/CartItem.ts
import Image from 'next/image';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useCollection } from '../hooks/useCollection';
import { useAuthContext } from '../hooks/useAuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import formatPrice from '../utils/formatPrice';
import { useEffect } from 'react';
import blankImage from '../../../public/blankImage.jpg';
import SelectingQuantityBox from '../components/SelectingQuantityBox';

export default function CartItem({ produto }: { produto: ProductCartType & FireBaseDocument }) {
    const { user } = useAuthContext();
    const { addOneToLocalStorage, removeOneFromLocalStorage, removeItemFromLocalStorageCart } = useLocalStorage();

    useEffect(() => {
        console.log('PRODUTOOOOO', produto);
    }, [produto]);

    const { updateDocumentField, deleteDocument } = useCollection(
        'carrinhos',
    );

    const addOne = () => {
        return user ? updateDocumentField(produto.id, 'quantidade', produto.quantidade +=1) : addOneToLocalStorage(produto);
    };

    const removeOne = () => {
        return user ? updateDocumentField(produto.id, 'quantidade', produto.quantidade -=1) : removeOneFromLocalStorage(produto);
    };

    const removeAll = () => {
        return user ? deleteDocument(produto.id) : removeItemFromLocalStorageCart(produto.skuId);
    };

    return (
        <div className='flex flex-col gap-4 w-full h-full p-4 bg-white shadow-lg rounded-lg shadowColor' >
            <div className='flex gap-4 w-full h-[90px] '>
                <div className='rounded-lg relative h-20 w-20 overflow-hidden flex-shrink-0'>
                    <Image
                        className='rounded-lg object-cover scale-125'
                        src={ produto.image ? produto.image : blankImage }
                        alt="Foto da peça"
                        fill
                    />
                </div>
                <div className='flex-grow text-xs'>

                    { /* <div className='rounded-lg relative w-3/4 overflow-hidden text-sm' > */ }
                    <p>{ produto.name }</p>
                </div>
                <div className='flex flex-col rounded-lg relative overflow-hidden text-sm text-blue-400 flex-grow' >
                    {
                        produto.customProperties && Object.entries(produto.customProperties).sort().map(([key, value]) => {
                            return (
                                <div key={ key } className="flex gap-2">
                                    <span>{ key }</span>
                                    <span>{ typeof value === 'string' ? value : 'Value not a string' }</span>
                                </div>
                            );
                        })
                    }
                </div>
                <FaRegTrashAlt
                    onClick={ removeAll }
                    data-testid={ 'trashButton' }/>
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