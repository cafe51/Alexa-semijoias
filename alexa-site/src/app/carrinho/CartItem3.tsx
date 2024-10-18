import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FireBaseDocument, ProductCartType } from '../utils/types';
import { useEffect } from 'react';
import { useCollection } from '../hooks/useCollection';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { formatPrice } from '../utils/formatPrice';
import { useAuthContext } from '../hooks/useAuthContext';
import { X } from 'lucide-react';
import blankImage from '../../../public/blankImage.jpg';
import Image from 'next/image';
import DisplayCustomProperties from '../components/DisplayCustomProperties';
import QuantitySelectionCartBox from '../components/QuantitySelectionCartBox';

interface CartItemProps {
    cartItem: ProductCartType | (ProductCartType & FireBaseDocument);
}

export default function CartItem({ cartItem }: CartItemProps) {
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
        <Card className="min-h-28 mb-4 overflow-hidden max-w-2xl mx-auto shadow-md shadow-[#C48B9F]">
            <CardContent className="p-0">
                <div className="flex flex-row gap-2  md:gap-4">
                    <div className='w-24 h-24 md:w-28 md:h-28 lg:w-40 lg:h-40 xl:w-56 xl:h-56 relative overflow-hidden flex-shrink-0'>
                        <Image
                            className='rounded-lg rounded-bl-none rounded-tr-none object-cover scale-100'
                            src={ cartItem.image ? cartItem.image : blankImage }
                            alt="Foto da peça"
                            priority
                            fill
                            sizes='224px'
                        />
                    </div>
                    <div className="flex-1 p-2 md:p-4 lg:p-6 flex flex-col justify-between relative">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute top-0 right-0 text-red-500 hover:bg-red-100 hover:text-red-700"
                            onClick={ removeAll }
                        >
                            <X className="h-4 w-4 md:w-6 md:h-6 lg:w-8 lg:h-8" />
                        </Button>
                        <div className='flex flex-col gap-2 justify-between h-full text-xs md:text-sm lg:text-base xl:text-lg flex-grow'>
                            <div className='flex flex-col justify-between h-full flex-grow'>
                                <h3 className="font-semibold text-sm md:text-lg lg:text-xl xl:text-2xl mb-1 md:mb-2 lg:mb-3 pr-8">
                                    { cartItem.name }
                                </h3>
                                { cartItem.customProperties && <DisplayCustomProperties customProperties={ cartItem.customProperties }/> }
                            </div>
                            <p className="text-gray-600 text-xs md:text-sm lg:text-base xl:text-lg mb-1 md:mb-2 lg:mb-4">
                                { formatPrice(cartItem.value.promotionalPrice || cartItem.value.price) }
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <QuantitySelectionCartBox
                                quantity={ cartItem.quantidade }
                                removeOne={ removeOne }
                                addOne={ addOne }
                                stock={ cartItem.estoque }
                            />
                            <p className="font-semibold text-sm md:text-lg lg:text-xl xl:text-2xl">
                                { formatPrice((cartItem.value.promotionalPrice || cartItem.value.price) * cartItem.quantidade) }
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}