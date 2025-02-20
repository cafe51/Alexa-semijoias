// src/app/components/MultiSelectModal.tsx
'use client';
import React from 'react';
import { FiX } from 'react-icons/fi';

interface MultiSelectModalProps {
  isOpen: boolean;
  selectedCount: number;
  onCancel: () => void;
  onDelete: () => void;
  onSelectAll: () => void;
  onModify: () => void; // nova prop para modificar
  isDeleting: boolean;
}

export default function MultiSelectModal({ isOpen, selectedCount, onCancel, onDelete, onSelectAll, onModify, isDeleting }: MultiSelectModalProps) {
    return (
        <div className={ `fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}` }>
            <div className="bg-white p-4 rounded-t-md w-full shadow-[0_-4px_8px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Opções de Multiseleção</h3>
                    <button onClick={ onCancel }>
                        <FiX size={ 24 } />
                    </button>
                </div>
                <div className="mt-4">
                    <p>{ selectedCount } item(s) selecionado(s)</p>
                </div>
                <div className="flex flex-col  justify-end gap-4 mt-4">
                    <button onClick={ onSelectAll } className="px-4 py-2 bg-blue-500 text-white rounded-md">
                        Selecionar Todos
                    </button>
                    <button onClick={ onModify } className="px-4 py-2 bg-green-500 text-white rounded-md">
                        Modificar Selecionados
                    </button>
                    <button onClick={ onCancel } className="px-4 py-2 bg-gray-300 rounded-md">Cancelar</button>
                    <button onClick={ onDelete } className="px-4 py-2 bg-red-500 text-white rounded-md" disabled={ isDeleting }>
                        { isDeleting ? 'Deletando...' : 'Deletar Selecionados' }
                    </button>
                </div>
            </div>
        </div>
    );
}
