/* 
// src/app/components/MassDeleteConfirmationModal.tsx
*/
'use client';
import React from 'react';
import { FiX } from 'react-icons/fi';

interface MassDeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
}

export default function MassDeleteConfirmationModal({ isOpen, onClose, onConfirm, isDeleting }: MassDeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-md shadow-md w-11/12 max-w-md">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Confirmação de Deleção</h3>
                    <button onClick={ onClose }>
                        <FiX size={ 24 } />
                    </button>
                </div>
                <div className="mt-4">
                    <p className="text-center">Tem certeza que deseja deletar os produtos selecionados?</p>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button onClick={ onClose } className="px-4 py-2 bg-gray-300 rounded-md">Não</button>
                    <button onClick={ onConfirm } className="px-4 py-2 bg-red-500 text-white rounded-md" disabled={ isDeleting }>
                        { isDeleting ? 'Deletando...' : 'Sim, deletar' }
                    </button>
                </div>
            </div>
        </div>
    );
}
