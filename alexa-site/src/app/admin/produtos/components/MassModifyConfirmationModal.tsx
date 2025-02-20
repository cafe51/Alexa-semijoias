// src/app/admin/produtos/components/MassModifyConfirmationModal.tsx
'use client';
import React from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';

interface MassModifyConfirmationModalProps {
  isModifying: boolean;
  modifications: { 
    showProduct: boolean | null; 
    lancamento: boolean | null; 
    removePromotion: boolean;
    priceModification: {
       value: number | null;
       type: 'percentual' | 'fixo' | null;
       operation: 'increase' | 'decrease' | null;
    }
  };
  selectedCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function MassModifyConfirmationModal({ isModifying, modifications, selectedCount, onClose, onConfirm }: MassModifyConfirmationModalProps) {
    const modificationDetails = [];
    if (modifications.showProduct !== null) {
        modificationDetails.push(`Visibilidade: ${modifications.showProduct ? 'Mostrar' : 'Ocultar'}`);
    }
    if (modifications.lancamento !== null) {
        modificationDetails.push(`Lançamento: ${modifications.lancamento ? 'Sim' : 'Não'}`);
    }
    if (modifications.removePromotion) {
        modificationDetails.push('Retirar da promoção');
    }
    if (modifications.priceModification && modifications.priceModification.value !== null && modifications.priceModification.type && modifications.priceModification.operation) {
        const { value, type, operation } = modifications.priceModification;
        if (type === 'fixo') {
            modificationDetails.push(`Preço: ${operation === 'increase' ? 'Aumentar' : 'Diminuir'} R$ ${value.toFixed(2)} (fixo)`);
        } else if (type === 'percentual') {
            modificationDetails.push(`Preço: ${operation === 'increase' ? 'Aumentar' : 'Diminuir'} ${value}% (percentual)`);
        }
    }

    return (
        <ModalMaker closeModelClick={ onClose } title="Confirmar Modificações em Massa">
            <div className="p-4">
                <p className="mb-4">Você está prestes a modificar { selectedCount } produto(s) com as seguintes alterações:</p>
                <ul className="list-disc list-inside mb-4">
                    { modificationDetails.map((detail, index) => (
                        <li key={ index }>{ detail }</li>
                    )) }
                </ul>
                <div className="flex justify-end gap-4">
                    <LargeButton color="gray" onClick={ onClose }>Cancelar</LargeButton>
                    <LargeButton color="blue" onClick={ onConfirm } disabled={ isModifying }>
                        { isModifying ? 'Modificando...' : 'Confirmar' }
                    </LargeButton>
                </div>
            </div>
        </ModalMaker>
    );
}
