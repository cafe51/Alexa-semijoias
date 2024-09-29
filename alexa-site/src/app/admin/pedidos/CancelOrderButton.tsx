import LargeButton from '@/app/components/LargeButton';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { FireBaseDocument, OrderType } from '@/app/utils/types';
import { useState } from 'react';

interface CancelOrderButtonProps {
    pedido: OrderType & FireBaseDocument;
    changeStatus: () => void
}

export default function CancelOrderButton({ pedido, changeStatus }: CancelOrderButtonProps) {
    const [confirmCancelModal, setConfirmCancelModal] = useState(false);
    const { updateDocumentField } = useCollection<OrderType>('pedidos');

    return (
        <>
            {
                confirmCancelModal && <ModalMaker title='Cancelar Pedido' closeModelClick={ () => setConfirmCancelModal(false) }>
                    <div className="flex flex-col gap-4">
                        <p>Tem certeza que deseja cancelar o pedido?</p>
                        <div className="flex justify-end gap-2">
                            <LargeButton color='red' onClick={ () => {
                                updateDocumentField(pedido.id, 'status', 'cancelado');
                                changeStatus();
                                setConfirmCancelModal(false);
                            } }>
                                Sim
                            </LargeButton>
                            <LargeButton color='green' onClick={ () => setConfirmCancelModal(false) }>
                                Voltar
                            </LargeButton>
                        </div>
                    </div>
                </ModalMaker>
            }


            <div className="text-sm font-medium p-4">
                <LargeButton color='red' onClick={  () => setConfirmCancelModal(true) }>
                        Cancelar Pedido
                </LargeButton>
            </div>
                    

        </>
    );
}