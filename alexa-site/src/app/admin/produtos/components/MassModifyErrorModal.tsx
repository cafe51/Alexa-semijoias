// src/app/admin/produtos/components/MassModifyErrorModal.tsx
'use client';
import React from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';

interface ErrorItem {
  productName: string;
  error: string;
}

interface MassModifyErrorModalProps {
  isOpen: boolean;
  errorItems: ErrorItem[];
  onClose: () => void;
}

export default function MassModifyErrorModal({ isOpen, errorItems, onClose }: MassModifyErrorModalProps) {
    if (!isOpen) return null;

    return (
        <ModalMaker closeModelClick={ onClose } title="Erro na Modificação de Produtos">
            <div className="p-4">
                <p className="mb-4 font-bold">Os seguintes produtos não puderam ser modificados:</p>
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
}
