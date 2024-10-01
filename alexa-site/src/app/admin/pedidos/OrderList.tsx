// OrderList.tsx
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import OrderCard from './OrderCard';
import { useState } from 'react';
import { emptyOrderTypeInitialState } from './emptyOrderTypeInitialState';
import SlideInModal from '@/app/components/ModalMakers/SlideInModal';
import { emptyUserTypeInitialState } from './emptyUserTypeInitialState';
import OrderDetails from './OrderDetails';


interface OrderListProps {
    pedidos: (OrderType  & FireBaseDocument)[];
    handleRefreshProductList: () => void
}

export default function OrderList({ pedidos, handleRefreshProductList }: OrderListProps) {
    const [selectedOrder, setSelectedProduct] = useState<OrderType & FireBaseDocument>(emptyOrderTypeInitialState);
    const [showOrderDetailModal, setShowOrderDetailModal] = useState<boolean>(false);
    const [userSelected, setUserSelected] = useState<UserType & FireBaseDocument>(emptyUserTypeInitialState);

    const handleSelectOrder = (order: OrderType & FireBaseDocument, user: UserType & FireBaseDocument) => {
        setSelectedProduct(order);
        setShowOrderDetailModal(true);
        setUserSelected(user);
    };

    return (
        <div className='flex flex-col gap-2 text-sm mt-4'>
            {
                pedidos.map((pedido) => (
                    <OrderCard key={ pedido.id } pedido={ pedido } handleSelectOrder={ handleSelectOrder }/>
                ))
            }
            <SlideInModal
                isOpen={ showOrderDetailModal }
                closeModelClick={ () => {
                    handleRefreshProductList();
                    setShowOrderDetailModal(false);
                } }
                title="Detalhes do Pedido"
                fullWidth
            >
                <OrderDetails pedido={ selectedOrder } user={ userSelected }/>
            </SlideInModal>
        </div>
    );
}
