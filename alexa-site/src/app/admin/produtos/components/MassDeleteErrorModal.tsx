// src/app/admin/produtos/components/MassDeleteErrorModal.tsx
import React from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';

interface ErrorItem {
  productName: string;
  error: string;
}

interface MassDeleteErrorModalProps {
  isOpen: boolean;
  errorItems: ErrorItem[];
  onClose: () => void;
}

const MassDeleteErrorModal: React.FC<MassDeleteErrorModalProps> = ({ isOpen, errorItems, onClose }) => {
    if (!isOpen) return null;

    return (
        <ModalMaker closeModelClick={ onClose } title="Erro na deleção de produtos">
            <div className="p-4">
                <p className="mb-4 font-bold">Os seguintes produtos não puderam ser deletados:</p>
                <ul className="mb-4 list-disc list-inside">
                    { errorItems.map((item, index) => (
                        <li key={ index } className="mb-2">
                            <strong>{ item.productName }</strong>: { item.error }
                        </li>
                    )) }
                </ul>
                <div className="flex justify-end">
                    <LargeButton color="blue" onClick={ onClose }>
            Fechar
                    </LargeButton>
                </div>
            </div>
        </ModalMaker>
    );
};

export default MassDeleteErrorModal;
