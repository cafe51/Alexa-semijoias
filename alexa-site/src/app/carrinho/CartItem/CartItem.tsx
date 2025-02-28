import { Card, CardContent } from '@/components/ui/card';
import { FireBaseDocument, ProductCartType } from '../../utils/types';
import { useEffect, useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuthContext } from '../../hooks/useAuthContext';
import blankImage from '../../../../public/blankImage.png';
import Image from 'next/image';
import StockWarning from '../../components/ProductPage/StockWarning';
import HeaderCartItem from './HeaderCartItem';
import QuantityAndPriceSection from './QuantityAndPriceSection';
import CustomPropertiesAndUnitPriceSection from './CustomPropertiesAndUnitPriceSection';
import { CartItemProps } from './cartCardInterfaces';

export default function CartItem({ cartItem }: CartItemProps) {
    const { user } = useAuthContext();
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const { addOneToLocalStorage, removeOneFromLocalStorage, removeItemFromLocalStorageCart } = useLocalStorage();
    const { updateDocumentField, deleteDocument } = useCollection('carrinhos');

    useEffect(() => {
        console.log('PRODUTOOOOO', cartItem);
    }, [cartItem]);

    let cartId: string;
    if (user) {
        const { id } = cartItem as ProductCartType & FireBaseDocument;
        cartId = id;
    }

    const addOne = () => {
        return user
            ? updateDocumentField(cartId, 'quantidade', (cartItem.quantidade += 1))
            : addOneToLocalStorage(cartItem);
    };

    const removeOne = () => {
        return user
            ? updateDocumentField(cartId, 'quantidade', (cartItem.quantidade -= 1))
            : removeOneFromLocalStorage(cartItem);
    };

    const removeAll = () => {
        return user ? deleteDocument(cartId) : removeItemFromLocalStorageCart(cartItem.skuId);
    };

    return (
        <Card className="mb-4 max-w-2xl mx-auto shadow-md shadow-[#C48B9F] rounded-md overflow-hidden">
            <CardContent className="p-0 text-[clamp(0.7rem,1.2vw,1.25rem)]">
                <div className="grid grid-rows-[auto,auto]">
                    <div className="grid grid-cols-[auto,1fr] items-start">
                        <div className="relative w-[clamp(100px,20vw,220px)] aspect-[4/5] flex-shrink-0">
                            <Image
                                src={ cartItem.image ? cartItem.image : blankImage }
                                alt="Foto da peça"
                                priority
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 40vw, (max-width: 1024px) 220px, 220px"
                            />
                        </div>

                        <div className="p-2 md:p-4 flex flex-col h-full gap-2">
                            <HeaderCartItem cartItem={ cartItem } removeAll={ removeAll } />

                            <div className="grid grid-cols-1 min-[345px]:grid-cols-2 flex-1 gap-2">
                                <CustomPropertiesAndUnitPriceSection cartItem={ cartItem } />
                                
                                <div className="hidden min-[345px]:flex min-[345px]:flex-col  justify-end items-center ">
                                    <QuantityAndPriceSection
                                        cartItem={ cartItem }
                                        removeOne={ removeOne }
                                        addOne={ addOne }
                                        setIsLoadingButton={ setIsLoadingButton }
                                        isLoadingButton={ isLoadingButton }
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="min-[345px]:hidden flex flex-row-reverse justify-around items-center py-2">
                        <QuantityAndPriceSection
                            cartItem={ cartItem }
                            removeOne={ removeOne }
                            addOne={ addOne }
                            setIsLoadingButton={ setIsLoadingButton }
                            isLoadingButton={ isLoadingButton }
                        />
                    </div>

                    { cartItem.estoque <= 3 && (
                        <footer className="p-0 pt-0 px-0 md:p-4]">
                            <StockWarning stock={ cartItem.estoque } />
                        </footer>
                    ) }
                </div>
            </CardContent>
        </Card>
    );
}
