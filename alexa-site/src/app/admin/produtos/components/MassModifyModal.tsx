// src/app/admin/produtos/components/MassModifyModal.tsx
'use client';
import React, { useState } from 'react';
import ModalMaker from '@/app/components/ModalMakers/ModalMaker';
import LargeButton from '@/app/components/LargeButton';

interface MassModifyModalProps {
  onClose: () => void;
  onConfirm: (options: { showProduct: boolean | null; lancamento: boolean | null; removePromotion: boolean }) => void;
}

export default function MassModifyModal({ onClose, onConfirm }: MassModifyModalProps) {
    const [showProduct, setShowProduct] = useState<boolean | null>(null);
    const [lancamento, setLancamento] = useState<boolean | null>(null);
    const [removePromotion, setRemovePromotion] = useState(false);

    const handleSubmit = () => {
        onConfirm({ showProduct, lancamento, removePromotion });
    };

    return (
        <ModalMaker closeModelClick={ onClose } title="Modificar Produtos Selecionados">
            <div className="p-4 flex flex-col gap-4">
                <div>
                    <p className="font-bold mb-2">Visibilidade na Loja:</p>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="showProduct"
                                value="true"
                                checked={ showProduct === true }
                                onChange={ () => setShowProduct(true) }
                            />
              Mostrar
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="showProduct"
                                value="false"
                                checked={ showProduct === false }
                                onChange={ () => setShowProduct(false) }
                            />
              Ocultar
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="showProduct"
                                value="null"
                                checked={ showProduct === null }
                                onChange={ () => setShowProduct(null) }
                            />
              Não alterar
                        </label>
                    </div>
                </div>
                <div>
                    <p className="font-bold mb-2">Lançamento:</p>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="lancamento"
                                value="true"
                                checked={ lancamento === true }
                                onChange={ () => setLancamento(true) }
                            />
              Sim
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="lancamento"
                                value="false"
                                checked={ lancamento === false }
                                onChange={ () => setLancamento(false) }
                            />
              Não
                        </label>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="lancamento"
                                value="null"
                                checked={ lancamento === null }
                                onChange={ () => setLancamento(null) }
                            />
              Não alterar
                        </label>
                    </div>
                </div>
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={ removePromotion }
                            onChange={ () => setRemovePromotion(!removePromotion) }
                        />
            Retirar da promoção (definir preço promocional para 0)
                    </label>
                </div>
                <div className="flex justify-end gap-4">
                    <LargeButton color="gray" onClick={ onClose }>
            Cancelar
                    </LargeButton>
                    <LargeButton color="blue" onClick={ handleSubmit }>
            Confirmar
                    </LargeButton>
                </div>
            </div>
        </ModalMaker>
    );
}
