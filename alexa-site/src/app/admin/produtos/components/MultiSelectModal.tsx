// src/app/components/MultiSelectModal.tsx
'use client';
import { Settings } from 'lucide-react';
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
                    <h3 className="font-bold text-lg text-center">{ selectedCount } { selectedCount > 1 ? 'itens selecionados' : 'item selecionado' }</h3>
                    <button onClick={ onCancel }>
                        <FiX size={ 24 } />
                    </button>
                </div>
                <div className="flex flex-col justify-end gap-4 mt-4">
                    <div className="flex justify-between  mt-4">
                        <button onClick={ onSelectAll } className="flex-1 py-2 px-4 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors">
                            Todos
                        </button>
                        <button onClick={ onDelete } className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors" disabled={ isDeleting }>
                            { isDeleting ? 'Deletando...' : 'Deletar' }
                        </button>
                    </div>
                    <button onClick={ onModify } className="w-full py-2 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center justify-center">
                        <Settings size={ 20 } className="mr-2" />Opções avançadas
                    </button>

                </div>
            </div>
        </div>
    );
}
