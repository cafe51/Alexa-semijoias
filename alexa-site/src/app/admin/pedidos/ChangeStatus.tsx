'use client';

import LargeButton from '@/app/components/LargeButton';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { sendEmailApprovedPayment, sendEmailOrderSent } from '@/app/utils/apiCall';
import { FireBaseDocument, OrderType, UserType } from '@/app/utils/types';
import { useState, useEffect } from 'react';

type StatusType = OrderType['status'];

interface ChangeStatusProps {
    pedido: OrderType & FireBaseDocument;
    changeStatus: (newStatus: StatusType) => void;
    initialStatus: StatusType;
}

const statusButtonTextMap: Record<StatusType, string> = {
    'aguardando pagamento': 'Marcar como preparando para o envio',
    'preparando para o envio': 'Marcar como pedido enviado',
    'pedido enviado': 'Marcar como entregue',
    'cancelado': 'Pedido cancelado',
    'entregue': 'Pedido entregue',
};

const getButtonText = (status: StatusType): string => {
    return statusButtonTextMap[status] || 'Atualizar status';
};

const nextStatusMap: Partial<Record<StatusType, StatusType>> = {
    'aguardando pagamento': 'preparando para o envio',
    'preparando para o envio': 'pedido enviado',
    'pedido enviado': 'entregue',
};

const getNextStatus = (currentStatus: StatusType): StatusType | null => {
    return nextStatusMap[currentStatus] || null;
};

export default function ChangeStatus({ pedido, changeStatus, initialStatus }: ChangeStatusProps) {
    const [changeStatusModal, setChangeStatusModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<StatusType>(initialStatus);
    const [nextStatus, setNextStatus] = useState<StatusType | null>(getNextStatus(initialStatus));
    const [showButton, setShowButton] = useState(true);
    const { updateDocumentField } = useCollection<OrderType>('pedidos');
    const { getDocumentById: getUserById } = useCollection<UserType>('usuarios');


    useEffect(() => {
        setNextStatus(getNextStatus(currentStatus));
    }, [currentStatus]);

    useEffect(() => {
        if (currentStatus === 'cancelado' || currentStatus === 'entregue' || initialStatus === 'cancelado' || initialStatus === 'entregue'){
            setShowButton(false);
        }

    }, [initialStatus, currentStatus]);

    const handleOpenModal = () => {
        setChangeStatusModal(true);
    };

    const handleStatusUpdate = async() => {
        const user = await getUserById(pedido.userId);

        if (!user) {
            console.error('Usuário não encontrado');
            return;
        }

        if (nextStatus) {
            if(nextStatus === 'preparando para o envio') {
                console.log('CHEGOU AQUI E O EMAIL FOI ENVIADO paymentApproved foi enviado');
                console.log('nextStatus é: ', nextStatus);
                await sendEmailApprovedPayment(pedido, user);
            }
            if(nextStatus === 'pedido enviado') {
                console.log('CHEGOU AQUI E O EMAIL FOI ENVIADO paymentSent foi enviado');
                console.log('nextStatus é: ', nextStatus);
                await sendEmailOrderSent(pedido, user);
            }
            
            updateDocumentField(pedido.id, 'status', nextStatus);
            changeStatus(nextStatus);
            setCurrentStatus(nextStatus);
            setChangeStatusModal(false);
        }
    };

    const renderModal = () => {
        if (!nextStatus) return null;

        return (
            <ModalMaker title='Atualizar status' closeModelClick={ () => setChangeStatusModal(false) }>
                <div className="flex flex-col gap-4">
                    <p>Tem certeza que deseja atualizar o status do pedido para: <span className='font-bold'>{ nextStatus }</span>?</p>
                    <div className="flex justify-end gap-2">
                        <LargeButton color='green' onClick={ handleStatusUpdate }>
                            Sim
                        </LargeButton>
                        <LargeButton color='green' onClick={ () => setChangeStatusModal(false) }>
                            Voltar
                        </LargeButton>
                    </div>
                </div>
            </ModalMaker>
        );
    };

    const renderButton = () => {
        if (!nextStatus) return null;

        return (
            <div className="text-xs font-bold p-4">
                <LargeButton color='green' onClick={ handleOpenModal }>
                    { getButtonText(currentStatus) }
                </LargeButton>
            </div>
        );
    };

    return (
        <>
            {
                changeStatusModal
                    ? renderModal()
                    : showButton && renderButton()
            }
        </>
    );
}