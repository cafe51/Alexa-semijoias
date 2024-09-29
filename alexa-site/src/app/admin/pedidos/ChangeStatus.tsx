'use client';

import LargeButton from '@/app/components/LargeButton';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import { useCollection } from '@/app/hooks/useCollection';
import { OrderType } from '@/app/utils/types';
import { useState, useEffect } from 'react';

type StatusType = OrderType['status'];

interface ChangeStatusProps {
    pedidoId: string;
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

export default function ChangeStatus({ pedidoId, changeStatus, initialStatus }: ChangeStatusProps) {
    const [changeStatusModal, setChangeStatusModal] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<StatusType>(initialStatus);
    const [nextStatus, setNextStatus] = useState<StatusType | null>(getNextStatus(initialStatus));
    const { updateDocumentField } = useCollection<OrderType>('pedidos');

    useEffect(() => {
        setNextStatus(getNextStatus(currentStatus));
    }, [currentStatus]);

    const handleOpenModal = () => {
        setChangeStatusModal(true);
    };

    const handleStatusUpdate = () => {
        if (nextStatus) {
            updateDocumentField(pedidoId, 'status', nextStatus);
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

    if (currentStatus === 'cancelado' || currentStatus === 'entregue') {
        return <div className="text-xs font-bold p-4">{ getButtonText(currentStatus) }</div>;
    }

    return (
        <>
            { changeStatusModal ? renderModal() : renderButton() }
        </>
    );
}